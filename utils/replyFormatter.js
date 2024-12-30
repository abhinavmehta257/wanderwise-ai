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
    await sendMessage(user_id, prompt);
  } else if (!data.collection_done) {
    await sendQuickReply(user_id, prompt, suggestions);
  } else if (data.collection_done) {
    sendButtonTemplate(
      user_id,
      "https://wisesquirrel.netlify.app/",
      "Check Now",
      "https://wisesquirrel.netlify.app/"
    );
  } else {
    await sendMessage(
      user_id,
      "We have encountered some error. Please try again later"
    );
  }
};
