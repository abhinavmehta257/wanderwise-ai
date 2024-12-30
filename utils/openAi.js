import { getConversationId } from "./insta";

export async function sendLangflowMessage(message, user_id) {
  const url =
    "https://api.langflow.astra.datastax.com/lf/6f410314-b88d-4319-b359-845184d0b5ae/api/v1/run/97e6af6d-d2cf-42fd-a410-a528b75760f4";
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
    throw new Error(`Error making request: ${error.message}`);
  }
}
