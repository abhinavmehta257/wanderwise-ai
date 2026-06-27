import axios from "axios";
import { createQuickReplies } from "./replyFormatter";

const PAGE_ACCESS_TOKEN = process.env.OURBABYPICS_ACCESS_TOKEN;
const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v21.0";
const MESSAGE_URL =
  process.env.META_MESSAGE_URL ||
  `https://graph.facebook.com/${GRAPH_API_VERSION}/me/messages`;

const metaHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
};

function logMetaError(action, error) {
  const metaError = error.response?.data?.error;
  console.error(`Error ${action}:`, metaError || error.message);
}

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

export const sendMessage = async (userId, messageText) => {
  try {
    await axios.post(
      MESSAGE_URL,
      {
        recipient: { id: userId },
        messaging_type: "RESPONSE",
        message: { text: messageText },
      },
      { headers: metaHeaders }
    );
  } catch (error) {
    logMetaError("sending message", error);
    throw error;
  }
};

export const sendTyping = async (userId, is_typing) => {
  try {
    await axios.post(
      MESSAGE_URL,
      {
        recipient: { id: userId },
        sender_action: is_typing ? "typing_on" : "typing_off",
      },
      { headers: metaHeaders }
    );
  } catch (error) {
    logMetaError("sending typing action", error);
    throw error;
  }
};

export const sendQuickReply = async (userId, messageText, quickReplies) => {
  const _quickReplies = createQuickReplies(quickReplies);

  try {
    await axios.post(
      MESSAGE_URL,
      {
        recipient: { id: userId },
        messaging_type: "RESPONSE",
        message: {
          text: messageText,
          quick_replies: _quickReplies.map((reply) => ({
            content_type: "text",
            title: reply.title,
            payload: reply.payload,
          })),
        },
      },
      { headers: metaHeaders }
    );
  } catch (error) {
    logMetaError("sending quick reply", error);
    throw error;
  }
};

export const sendPrivateReplyToComment = async (commentId, messageText) => {
  try {
    await axios.post(
      MESSAGE_URL,
      {
        recipient: { comment_id: commentId },
        message: { text: messageText },
      },
      { headers: metaHeaders }
    );
  } catch (error) {
    logMetaError("sending private reply to comment", error);
    throw error;
  }
};

export const sendButtonTemplate = async (
  userId,
  buttonUrl,
  text,
  buttonTitle = "Check out now!"
) => {
  try {
    await axios.post(
      MESSAGE_URL,
      {
        recipient: { id: userId },
        messaging_type: "RESPONSE",
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: text,
              buttons: [
                {
                  type: "web_url",
                  url: buttonUrl,
                  title: buttonTitle,
                  webview_height_ratio: "full",
                },
              ],
            },
          },
        },
      },
      { headers: metaHeaders }
    );
  } catch (error) {
    logMetaError("sending button template", error);
    throw error;
  }
};

export const sendActionQuickReply = async (userId, messageText, actions) => {
  try {
    await axios.post(
      MESSAGE_URL,
      {
        recipient: { id: userId },
        messaging_type: "RESPONSE",
        message: {
          text: messageText,
          quick_replies: actions.map((action) => ({
            content_type: "text",
            title: action.title.slice(0, 20),
            payload: action.payload,
          })),
        },
      },
      { headers: metaHeaders }
    );
  } catch (error) {
    logMetaError("sending action quick reply", error);
    throw error;
  }
};
