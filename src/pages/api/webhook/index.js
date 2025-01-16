// import { sendMessage } from "@/utils/sendMessage";

import { getConversationId } from "../../../../utils/insta";
import { callAssistant, sendLangflowMessage } from "../../../../utils/openAi";
import { replay } from "../../../../utils/replyFormatter";
import {
  sendMessage,
  sendQuickReply,
  sendTyping,
  sendTypingOn,
} from "../../../../utils/sendMessage";

export default async function handler(req, res) {
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
    
    if( req.body.entry[0].changes){
      if( req.body.entry[0].changes[0].field=="comments"){
        const sender_id = req.body.entry[0].changes[0].value.from.id;
        await sendQuickReply(sender_id,"Thanks for commenting! would you like to start planning tirp 🧳🏖",['Yes, start planning']);
      }
    }
    
    if (req.body.entry[0].messaging) {
      const messagingEvents = req.body.entry[0].messaging[0];
      // Check if the event is a message and not an echo
        if (messagingEvents.message && messagingEvents.message.text && !messagingEvents.message.is_echo) {
          const text = messagingEvents.message.text;
          const senderId = messagingEvents.sender.id;
          console.log(messagingEvents);
          await callAssistant(text, senderId)
            .then((result) => replay(senderId, result))
            .catch(async (error) => {sendMessage(senderId,);
              await sendButtonTemplate(
                    user_id,
                    `${process.env.NEXT_PUBLIC_BASE_URL}/trip`,
                    `${process.env.NEXT_PUBLIC_BASE_URL}/trip`,
                    "We have encountered some error. Please try again later"
                  );
              console.error(error)});
        }
    }

    return res.status(200).send("EVENT_RECEIVED");
  } else if (req.body.entry[0].changes) {
    console.log(req.body.entry[0].changes[0]);
  }

  // Return 405 Method Not Allowed for other methods
  return res.status(405).end();
}
