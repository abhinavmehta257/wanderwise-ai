import { callAssistant, getGeneratedTrip } from "./openAi";
import { sendButtonTemplate, sendMessage, sendQuickReply } from "./sendMessage";

export const createQuickReplies = (items) => {
  return items.map((item) => ({
    title: item,
    payload: `LOCATION_${item.toUpperCase().replace(/\s+/g, "_")}`,
  }));
};
export const replay = async (user_id, text) => {
  const data = JSON.parse(text);
  const { prompt, suggestions } = data;
  console.log(data.trip_details.is_finalized);
  
  if (data.trip_details.is_finalized) {
    // First response - acknowledge the request
    await sendMessage(
      user_id,
      `Starting to generate your trip details for ${data.trip_details.destination}. You'll receive the link shortly.`
    );

    // Trigger trip generation in a separate API call
    try {
      const response = await fetch('/api/trip/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_SECRET_KEY
        },
        body: JSON.stringify({
          user_id,
          destination: data.trip_details.destination,
          number_of_days: data.trip_details.number_of_days
        })
      });

      // Send initial acknowledgment
      await sendMessage(
        user_id,
        "Your trip is being generated. You'll receive the link as soon as it's ready."
      );

    } catch (error) {
      await sendMessage(
        user_id,
        "We encountered an error starting trip generation. Please try again later."
      );
    }
  } else {
    // Handle other cases as before
    if (!suggestions || suggestions.length === 0) {
      await sendMessage(user_id, prompt);
    } else {
      await sendQuickReply(user_id, prompt, suggestions);
    }
  }
};
