import { getConversationId } from "./insta";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: '' });

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

export const callAssistant = async (message_text, user_id)=>{
  // const conversation_id = await getConversationId(user_id);

  const thread = await openai.beta.threads.create({thread_id:"123123"});
  console.log(thread);
  
  const message = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: message_text
    }
    );
    let run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      { 
        assistant_id: "asst_MdQvLytr35uEM52fKsRSuhEX",
      }
      );
  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(
      run.thread_id
    );
    // for (const message of messages.data.reverse()) {
    //   console.log(`${message.role} > ${message.content[0].text.value}`);
    // }
    console.log(messages.data[0].content[0].text.value);
    return messages.data[0].content[0].text.value;
  } else {
    console.log(run.status);
  }    
}