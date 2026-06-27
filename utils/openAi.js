import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
import redis from "./redis";
import TripDetails from '../model/itinerary';
import connectDB from "../db/db";
import { buildLocationQuery, normalizeLocation } from "./location";
const { createApi } = require('unsplash-js');

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY
});

const ACTIVE_RUN_STATUSES = new Set([
  "queued",
  "in_progress",
  "requires_action",
  "cancelling",
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForActiveRuns(thread_id, maxWaitMs = 120000) {
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const runs = await openai.beta.threads.runs.list(thread_id, {
      limit: 5,
      order: "desc",
    });
    const activeRun = runs.data.find((run) => ACTIVE_RUN_STATUSES.has(run.status));

    if (!activeRun) {
      return;
    }

    if (activeRun.status === "requires_action") {
      console.warn("Cancelling run waiting for unsupported tool action:", activeRun.id);
      await openai.beta.threads.runs.cancel(thread_id, activeRun.id);
      await sleep(1000);
      continue;
    }

    await sleep(2000);
  }

  const runs = await openai.beta.threads.runs.list(thread_id, { limit: 5, order: "desc" });
  for (const run of runs.data) {
    if (ACTIVE_RUN_STATUSES.has(run.status)) {
      try {
        await openai.beta.threads.runs.cancel(thread_id, run.id);
      } catch (error) {
        console.warn("Failed to cancel active run:", run.id, error.message);
      }
    }
  }
}

async function withUserLock(user_id, fn) {
  const lockKey = `lock:${user_id}`;

  for (let attempt = 0; attempt < 60; attempt++) {
    const acquired = await redis.set(lockKey, "1", { nx: true, ex: 120 });
    if (acquired) {
      try {
        return await fn();
      } finally {
        await redis.del(lockKey);
      }
    }
    await sleep(1000);
  }

  throw new Error(`Timed out waiting for assistant lock for user ${user_id}`);
}

export async function getDestinationImage(destination) {
  try {
    const result = await unsplash.search.getPhotos({
      query: destination,
      page: 1,
      perPage: 1,
      orientation: 'landscape'
    });

    if (result.response?.results?.length > 0) {
      return result.response.results[0].urls.regular;
    }
    return "/traveller.jpeg"; // Fallback image
  } catch (error) {
    console.error('Error fetching destination image:', error);
    return "/traveller.jpeg"; // Fallback image
  }
}


export const callAssistant = async (message_text, user_id, assistant_id = "asst_MdQvLytr35uEM52fKsRSuhEX", _thread_id) => {
  return withUserLock(user_id, async () => {
    try {
      let thread_id = _thread_id;

      if (!thread_id) {
        thread_id = await redis.get(`thread:${user_id}`);
      }

      if (thread_id) {
        try {
          await openai.beta.threads.retrieve(thread_id);
        } catch (error) {
          console.warn("Stale thread ID, removing from Redis:", thread_id, error.message);
          await redis.del(`thread:${user_id}`);
          thread_id = null;
        }
      }

      if (!thread_id) {
        const thread = await openai.beta.threads.create();
        console.log("New thread created:", thread.id);
        thread_id = thread.id;

        await redis.set(`thread:${user_id}`, thread_id, { ex: 86400 });
      }

      await waitForActiveRuns(thread_id);

      await openai.beta.threads.messages.create(thread_id, {
        role: "user",
        content: message_text,
      });

      const run = await openai.beta.threads.runs.createAndPoll(thread_id, {
        assistant_id,
      });

      if (run.status === "completed") {
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        const response = messages.data[0].content[0].text.value;
        console.log("Assistant response:", response);
        return response;
      }

      console.error("Assistant run did not complete:", {
        status: run.status,
        last_error: run.last_error,
        incomplete_details: run.incomplete_details,
        thread_id,
        assistant_id,
      });

      if (run.status === "failed") {
        await redis.del(`thread:${user_id}`);
      }

      return "The assistant couldn't process your request. Please try again.";
    } catch (error) {
      console.error("Error in callAssistant:", error);
      return "An error occurred. Please try again.";
    }
  });
};


export async function findExistingTrip(location, numberOfDays) {
  await connectDB();
  return TripDetails.findOne({
    ...buildLocationQuery(location),
    numberOfDays,
  });
}

function buildTripPrompt({
  location,
  numberOfDays,
  datePreference,
  startDate,
  endDate,
}) {
  let dateContext = "Dates are flexible — suggest a general best time to visit.";

  if (datePreference === "specific" && startDate) {
    dateContext = endDate
      ? `Travel dates: ${startDate} to ${endDate}.`
      : `Travel start date: ${startDate}.`;
  }

  return `Generate a complete ${numberOfDays}-day trip itinerary for ${location}. ${dateContext} Return the response as JSON only.`;
}

export async function createTrip(user_id, options) {
  const {
    location,
    numberOfDays,
    datePreference = "flexible",
    startDate,
    endDate,
    creator,
    force = false,
  } = options;

  await connectDB();

  if (!force) {
    const existing = await findExistingTrip(location, numberOfDays);
    if (existing) {
      return {
        slug: existing.slug,
        isExisting: true,
        creator: existing.creator || null,
      };
    }
  }

  const assistant_id = "asst_xNE0S4tbeV82C0u6NGajPlVc";
  const prompt = buildTripPrompt({
    location,
    numberOfDays,
    datePreference,
    startDate,
    endDate,
  });

  const response = await callAssistant(
    prompt,
    `${user_id}:trip-gen`,
    assistant_id
  );
  const data = JSON.parse(response);
  const { number_of_days } = data;
  const { title } = data.meta_data;
  const { destination } = data.overview;
  const slug = titleToSlug(title);
  const destination_image = await getDestinationImage(destination);

  const newTrip = new TripDetails({
    slug,
    numberOfDays: number_of_days,
    location: normalizeLocation(destination),
    title,
    destination_image_url: destination_image,
    data,
    creator: creator || undefined,
    datePreference,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  await newTrip.save();

  return {
    slug: newTrip.slug,
    isExisting: false,
    creator: newTrip.creator || null,
  };
}

export const getGeneratedTrip = async (
  user_id,
  location,
  numberOfDays,
  options = {}
) => {
  const result = await createTrip(user_id, {
    location,
    numberOfDays,
    ...options,
  });

  return result.slug;
};

function titleToSlug(title) {
  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}