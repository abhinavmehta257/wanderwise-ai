import { callAssistant } from "./openAi";
import { sendButtonTemplate, sendMessage, sendQuickReply } from "./sendMessage";

export const createQuickReplies = (items) => {
  return items.map((item) => ({
    title: item,
    payload: `LOCATION_${item.toUpperCase().replace(/\s+/g, "_")}`,
  }));
};
export const replay = async (user_id, text) => {
  console.log(text);

  const data = JSON.parse(text);
  const { prompt, suggestions } = data;
  if (!suggestions) {
    sendMessage(user_id, prompt);
  } else if (!data.trip_details.is_finalized) {
    sendQuickReply(user_id, prompt, suggestions);
  } else if (data.trip_details.is_finalized) {
    sendMessage(
      user_id,
      "Plesae wait while we generate your trip details"
    );
    await callAssistant(data.trip_details, user_id, "asst_xNE0S4tbeV82C0u6NGajPlVc");
  } else {
    sendMessage(
      user_id,
      "We have encountered some error. Please try again later"
    );
  }
};
