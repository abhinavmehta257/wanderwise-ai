import { getConversationId } from "./insta";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
import Redis from "ioredis";
import TripDetails from '../model/itinerary';
import connectDB from "../db/db";

// Initialize Redis with your Vercel Redis URL
const redis = new Redis(process.env.REDIS_URL);

export async function sendLangflowMessage(message, user_id) {
  const url =process.env.LANF_FLOW_URL;
  const conversation_id = await getConversationId(user_id);

  // Request configuration
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LANG_FLOW_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      input_value: message,
      output_type: "chat",
      input_type: "chat",
      session_id: conversation_id,
      tweaks: {
        "Agent-mVPOm": {},
        "ChatInput-n3FUw": {},
        "ChatOutput-DRnzL": {},
      },
    }),
  };

  try {
    const response = await fetch(`${url}?stream=false`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.outputs[0].outputs[0].results.message.text;
  } catch (error) {
    // return "we have encountered some error, please repeat your answer";

    throw new Error({err:`Error making request: ${error.message}`,message:"we have encountered some error, please repeat your answer"});
  }
}



export const callAssistant = async (message_text, user_id, assistant_id = "asst_MdQvLytr35uEM52fKsRSuhEX") => {
  let thread_id;

  try {
    // Check if a thread already exists for this user in Redis
    thread_id = await redis.get(`thread:${user_id}`);

    if (!thread_id) {
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
    const {number_of_days, destination_image_url } = data;
    const {title} = data.meta_data;
    const {destination} = data.overview;
    const slug = titleToSlug(title);
    const destination_image = destination_image_url.length >0 ? destination_image_url : "/traveller.jpeg";
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