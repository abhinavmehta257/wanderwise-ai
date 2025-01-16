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
  
  if ((!suggestions || suggestions.length === 0)&& !data.trip_details.is_finalized) {
    await sendMessage(user_id, prompt);
  } else if (!data.trip_details.is_finalized) {
    await sendQuickReply(user_id, prompt, suggestions);
  } else if (data.trip_details.is_finalized) {
    await sendMessage(
      user_id,
      "Plesae wait while we generate your trip details"
    );
    const slug = await getGeneratedTrip(user_id, data.trip_details.destination, data.trip_details.number_of_days);
    await sendButtonTemplate(
      user_id,
      `${process.env.NEXT_PUBLIC_BASE_URL}/trip/${slug}`,
      `${process.env.NEXT_PUBLIC_BASE_URL}/trip/${slug}`
    );
  } else {
    await sendMessage(
      user_id,
      "We have encountered some error. Please try again later"
    );
  }
};
