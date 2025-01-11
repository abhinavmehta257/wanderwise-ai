import axios from "axios";
import { createQuickReplies } from "./replyFormatter";
import { getConversationId } from "./insta";
const PAGE_ACCESS_TOKEN = process.env.OURBABYPICS_ACCESS_TOKEN;
const url = process.env.META_MESSAGE_URL;
export const sendMessage = async (userId, messageText) => {
  let response;
  try {
    response = await axios.post(
      url,
      {
        recipient: { id: userId },
        message: { text: messageText },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
          messaging_type: "RESPONSE",
        },
      }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
export const sendTyping = async (userId, is_typing) => {
  let response;
  console.log(userId);

  try {
    response = await axios.post(
      url,
      {
        recipient: { id: userId },
        sender_action: is_typing ? "typing_on" : "typing_off",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        },
      }
    );
  } catch (error) {
    console.error("Error sending typing action:", error);
    throw error;
  }
};

export const sendQuickReply = async (userId, messageText, quickReplies) => {
  const _quickReplies = createQuickReplies(quickReplies);
  let response;
  try {
    response = await axios.post(
      url,
      {
        recipient: { id: userId },
        session_id: userId,
        message: {
          text: messageText,
          quick_replies: _quickReplies.map((reply) => ({
            content_type: "text",
            title: reply.title,
            payload: reply.payload,
          })),
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        },
      }
    );
  } catch (error) {
    console.error("Error sending quick reply:", error);
    throw error;
  }
};

export const sendButtonTemplate = async (
  userId,
  imageUrl,
  buttonUrl
) => {
  let response;
  try {
    response = await axios.post(
      url,
      {
        recipient: { id: userId },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: "Click below to view your trip details",
              buttons: [
                {
                  type: "web_url",
                  url: buttonUrl,
                  title: "Check out now!",
                  webview_height_ratio: "full",
                  image_url: imageUrl,
                },
              ],
            },
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        },
      }
    );
  } catch (error) {
    console.error("Error sending button template:", error);
    throw error;
  }
};
