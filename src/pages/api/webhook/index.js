import { handleInstagramMessage } from "../../../../utils/instagramFlow";
import {
  sendMessage,
  sendPrivateReplyToComment,
} from "../../../../utils/sendMessage";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const VERIFY_TOKEN = process.env.INSTA_VERIFICATION_STRING;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }

    return res.status(403).end();
  }

  if (req.method === "POST") {
    if (req.body.entry?.[0]?.changes) {
      const change = req.body.entry[0].changes[0];
      if (change.field === "comments") {
        const commentId = change.value.id;
        await sendPrivateReplyToComment(
          commentId,
          "Thanks for commenting! Send us a message here to plan a trip or browse existing ones."
        );
      }
    }

    if (req.body.entry?.[0]?.messaging) {
      const messagingEvents = req.body.entry[0].messaging[0];
      const message = messagingEvents.message;

      if (message && !message.is_echo) {
        const senderId = messagingEvents.sender.id;
        const text = message.text || "";
        const payload = message.quick_reply?.payload;

        if (text || payload) {
          console.log("[instagram-flow:v2] webhook received message", {
            senderId,
            text,
            payload,
          });
          try {
            await handleInstagramMessage(senderId, text, payload);
          } catch (error) {
            console.error("Instagram flow error:", error);
            try {
              await sendMessage(
                senderId,
                "We encountered an error. Please try again later."
              );
            } catch (sendError) {
              console.error("Failed to send error message:", sendError);
            }
          }
        }
      }
    }

    return res.status(200).send("EVENT_RECEIVED");
  }

  return res.status(405).end();
}
