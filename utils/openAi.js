import TripDetails from '../model/itinerary';
import connectDB from "../db/db";
import { buildLocationQuery, normalizeLocation } from "./location";
import { createResponse } from "./ai/responses";
import { TRIP_PLANNING_SCHEMA } from "./ai/schemas/tripPlanning";
import { TRIP_PLANNER_INSTRUCTIONS } from "./ai/prompts/tripPlanner";
import { getDestinationImage } from "./destinationImage";

const MAX_GENERATION_ATTEMPTS = 3;
export const MAX_TRIP_DESCRIPTION_LENGTH = 229;

export function validateItineraryComplete(data, expectedDays) {
  if (!data?.itinerary || !Array.isArray(data.itinerary)) {
    return false;
  }

  if (data.itinerary.length !== expectedDays) {
    return false;
  }

  for (let day = 1; day <= expectedDays; day += 1) {
    const dayEntry = data.itinerary.find(
      (entry) => Number(entry.day) === day
    );

    if (!dayEntry?.title?.trim()) {
      return false;
    }

    if (!Array.isArray(dayEntry.activities) || dayEntry.activities.length < 2) {
      return false;
    }

    const hasCompleteActivity = dayEntry.activities.every(
      (activity) =>
        activity?.time_of_day?.trim() &&
        activity?.activity?.trim() &&
        activity?.details?.trim()
    );

    if (!hasCompleteActivity) {
      return false;
    }
  }

  return true;
}

function truncateDescription(text, maxLength = MAX_TRIP_DESCRIPTION_LENGTH) {
  if (!text || text.length <= maxLength) {
    return text;
  }

  const ellipsis = "…";
  const sliceLength = maxLength - ellipsis.length;
  const trimmed = text.slice(0, sliceLength);
  const lastSpace = trimmed.lastIndexOf(" ");

  if (lastSpace > sliceLength * 0.6) {
    return `${trimmed.slice(0, lastSpace).trimEnd()}${ellipsis}`;
  }

  return `${trimmed.trimEnd()}${ellipsis}`;
}

function normalizeTripData(data, location) {
  if (location && data?.overview) {
    data.overview.destination = location;
  }

  if (data?.overview?.description) {
    data.overview.description = truncateDescription(data.overview.description);
  }

  return data;
}

export async function findExistingTrip(location, numberOfDays) {
  await connectDB();
  return TripDetails.findOne({
    ...buildLocationQuery(location),
    numberOfDays,
  });
}

function formatBudgetContext(budget) {
  if (!budget?.tier) {
    return "";
  }

  const tierLabel = budget.tier.replace(/-/g, " ");
  let context = `Budget preference: ${tierLabel}.`;

  if (budget.amount && budget.currency) {
    context += ` Target total trip cost around ${budget.amount} ${budget.currency}; ensure budget_breakdown.total is close to this figure.`;
  } else {
    context += " No fixed budget cap — estimate realistic costs for this tier.";
  }

  return context;
}

export function buildTripPrompt({
  location,
  numberOfDays,
  datePreference,
  startDate,
  endDate,
  budget,
  creatorName,
  retryNote,
}) {
  let dateContext = "Dates are flexible — suggest a general best time to visit.";

  if (datePreference === "specific" && startDate) {
    dateContext = endDate
      ? `Travel dates: ${startDate} to ${endDate}.`
      : `Travel start date: ${startDate}.`;
  }

  const budgetContext = formatBudgetContext(budget);
  const authorContext = creatorName
    ? `Use "${creatorName}" as meta_data.author.`
    : 'Use "Wanderwise" as meta_data.author if no creator is provided.';

  const parts = [
    `Generate a complete ${numberOfDays}-day trip itinerary for ${location}.`,
    `Set overview.destination to exactly "${location}".`,
    dateContext,
    budgetContext,
    authorContext,
    `Set number_of_days to exactly ${numberOfDays}.`,
    `The itinerary array MUST contain exactly ${numberOfDays} objects with day values 1 through ${numberOfDays}.`,
    `Each day MUST include morning, afternoon, and evening activities with location, duration, and practical details.`,
    `overview.description MUST be under 230 characters (max ${MAX_TRIP_DESCRIPTION_LENGTH}) — short teaser only.`,
    "Select dining and activities that match the budget level.",
    retryNote,
    "Return the response as JSON only.",
  ].filter(Boolean);

  return parts.join(" ");
}

async function generateTripData({
  location,
  numberOfDays,
  datePreference,
  startDate,
  endDate,
  budget,
  creatorName,
  userId,
  onProgress,
}) {
  let lastData = null;

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const retryNote =
      attempt > 1
        ? `CRITICAL RETRY ${attempt}: Previous output was incomplete. You MUST return exactly ${numberOfDays} full days in itinerary with day numbers 1 to ${numberOfDays}, each with detailed morning, afternoon, and evening activities.`
        : "";

    if (onProgress) {
      await onProgress(
        attempt > 1 ? "Polishing your itinerary..." : "Gathering trip details...",
        attempt > 1 ? 46 : 52
      );
    }

    const prompt = buildTripPrompt({
      location,
      numberOfDays,
      datePreference,
      startDate,
      endDate,
      budget,
      creatorName,
      retryNote,
    });

    const { text } = await createResponse({
      instructions: TRIP_PLANNER_INSTRUCTIONS,
      input: prompt,
      schema: TRIP_PLANNING_SCHEMA,
      schemaName: "trip_planning",
      userId: `${userId}:trip-gen`,
    });

    const data = JSON.parse(text);
    lastData = data;

    if (validateItineraryComplete(data, numberOfDays)) {
      data.number_of_days = numberOfDays;
      return normalizeTripData(data, location);
    }

    console.warn(
      `Itinerary validation failed for ${location} (${numberOfDays} days) on attempt ${attempt}`,
      {
        receivedDays: data.itinerary?.length,
        days: data.itinerary?.map((entry) => entry.day),
      }
    );
  }

  throw new Error(
    `Could not generate a complete ${numberOfDays}-day itinerary for ${location}`
  );
}

export async function createTrip(user_id, options) {
  const {
    location,
    numberOfDays,
    datePreference = "flexible",
    startDate,
    endDate,
    creator,
    budget,
    force = false,
    onProgress,
  } = options;

  await connectDB();

  if (!force) {
    const existing = await findExistingTrip(location, numberOfDays);
    if (existing) {
      if (onProgress) {
        await onProgress("Found a matching trip!", 100);
      }
      return {
        slug: existing.slug,
        isExisting: true,
        creator: existing.creator || null,
      };
    }
  }

  if (onProgress) {
    await onProgress("Polishing your itinerary...", 44);
  }

  const data = await generateTripData({
    location,
    numberOfDays,
    datePreference,
    startDate,
    endDate,
    budget,
    creatorName: creator?.name,
    userId: user_id,
    onProgress,
  });

  const { title } = data.meta_data;
  const { destination } = data.overview;
  const slug = titleToSlug(title);
  const destination_image = await getDestinationImage(location, destination);

  const newTrip = new TripDetails({
    slug,
    numberOfDays,
    location: normalizeLocation(location || destination),
    title,
    destination_image_url: destination_image,
    data,
    creator: creator || undefined,
    datePreference,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    budgetPreference: budget || undefined,
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
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
