import { getConversationId } from "./insta";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
import Redis from "ioredis";
import TripDetails from '../model/itinerary';
import connectDB from "../db/db";
const { createApi } = require('unsplash-js');


// Initialize Redis with your Vercel Redis URL
const redis = new Redis(process.env.REDIS_URL);

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY
});

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
  let thread_id = _thread_id;

  try {
    // Check if a thread already exists for this user in Redis
    thread_id = await redis.get(`thread:${user_id}`);

    if (!thread_id && !_thread_id) {
      // Create a new thread if none exists
      const thread = await openai.beta.threads.create();
      console.log("New thread created:", thread);
      thread_id = thread.id;

      // Save the thread ID in Redis
      const redis_thread_set = await redis.set(`thread:${user_id}`, thread_id, "EX", 86400);
      console.log("Redis thread set:", redis_thread_set);
      
    }

    // Add the user's message to the thread
    const message = await openai.beta.threads.messages.create(thread_id, {
      role: "user",
      content: message_text,
    });

    // Process the assistant's response
    const run = await openai.beta.threads.runs.createAndPoll(thread_id, {
      assistant_id: assistant_id,
    });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      const response = messages.data[0].content[0].text.value;
      console.log("Assistant response:", response);

      return response;
    } else {
      console.log("Run status:", run.status);
      return "The assistant couldn't process your request. Please try again.";
    }
  } catch (error) {
    console.error("Error in callAssistant:", error);
    return "An error occurred. Please try again.";
  }
};


export const getGeneratedTrip = async (user_id, location, numberOfDays) => {
  await connectDB();

  const trip = await TripDetails.findOne({ location, numberOfDays });

  console.log("trip:", trip);

  if (trip) {
    return trip.slug;
  }
  else {   
    const assistant_id = "asst_xNE0S4tbeV82C0u6NGajPlVc";
    const response = await callAssistant("the trip acording to the provided details", user_id, assistant_id);
    const data = JSON.parse(response);
    const {number_of_days} = data;
    const {title} = data.meta_data;
    const {destination} = data.overview;
    const slug = titleToSlug(title);
    const destination_image = await getDestinationImage(destination);
    const newTrip = new TripDetails({
            slug,
            numberOfDays:number_of_days,
            location:destination,
            title,
            destination_image_url:destination_image,
            data,
          });
    
    await newTrip.save();

    console.log("newTrip:", newTrip);

    return slug;
  }
};

function titleToSlug(title) {
  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}