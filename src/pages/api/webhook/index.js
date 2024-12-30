// import { sendMessage } from "@/utils/sendMessage";

import { getConversationId } from "../../../../utils/insta";
import { sendLangflowMessage } from "../../../../utils/openAi";
import { replay } from "../../../../utils/replyFormatter";
import {
  sendMessage,
  sendQuickReply,
  sendTypingOn,
} from "../../../../utils/sendMessage";

export default function handler(req, res) {
  // Handle GET request (verification)
  if (req.method === "GET") {
    const VERIFY_TOKEN = process.env.INSTA_VERIFICATION_STRING;
    console.log(VERIFY_TOKEN);

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    console.log(mode);

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).end();
    }
  }

  // Handle POST request (incoming messages)
  if (req.method === "POST") {
    if (req.body.entry[0].messaging) {
      const messagingEvents = req.body.entry[0].messaging;
      messagingEvents.forEach((event) => {
        const senderId = event.sender.id;
        if (event.message && event.message.text && !event.message.is_echo) {
          // Call GPT-4 API or custom logic for responses
          //   generateRes();
          //   sendTypingOn();
          //   sendQuickReply(senderId, "response");
          //   ;
          const text = event.message.text;
          console.log(event);
          sendLangflowMessage(text, event.sender.id)
            .then((result) => replay(event.sender.id, result))
            .catch((error) => console.error(error));
        }
      });
    }
    return res.status(200).send("EVENT_RECEIVED");
  } else if (req.body.entry[0].changes) {
    console.log(req.body.entry[0].changes[0]);
  }

  // Return 405 Method Not Allowed for other methods
  return res.status(405).end();
}
