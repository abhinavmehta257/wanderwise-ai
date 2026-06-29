import {
  appendConversationTurn,
  clearConversationHistory,
  clearStoredResponseId,
  createResponse,
  getConversationHistory,
  getStoredResponseId,
  setStoredResponseId,
} from "../../../../utils/ai/responses";
import { TRAVEL_SCHEMA } from "../../../../utils/ai/schemas/travelSchema";
import { TRAVEL_AGENT_INSTRUCTIONS } from "../../../../utils/ai/prompts/travelAgent";

function formatHistoryForClient(history) {
  return history.map((item, index) => {
    const formatted = {
      id: `history-${index}`,
      role: item.role,
      timestamp: new Date(item.timestamp).toLocaleString(),
      content: item.content,
    };

    if (item.role === "assistant") {
      try {
        const parsed = JSON.parse(item.content);
        formatted.content = parsed.prompt || item.content;
        formatted.suggestions = parsed.suggestions || [];
        formatted.tripDetails = parsed.trip_details || null;
      } catch {
        formatted.content = item.content;
      }
    }

    return formatted;
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const userId = req.cookies.chatUserId;

    if (!userId) {
      return res.status(200).json([]);
    }

    try {
      const history = await getConversationHistory(userId);
      return res.status(200).json(formatHistoryForClient(history));
    } catch (error) {
      console.error("Error fetching conversation history:", error);
      return res.status(500).json({ error: "Failed to retrieve conversation" });
    }
  }

  if (req.method === "POST") {
    const { user, message } = req.body;

    if (!user || !message) {
      return res.status(400).json({ error: "User and message are required" });
    }

    try {
      const userId = String(user);
      const previousResponseId = await getStoredResponseId(userId);

      await appendConversationTurn(userId, "user", message);

      const { text, responseId } = await createResponse({
        instructions: TRAVEL_AGENT_INSTRUCTIONS,
        input: message,
        schema: TRAVEL_SCHEMA,
        schemaName: "travel_schema",
        previousResponseId,
        userId,
      });

      await setStoredResponseId(userId, responseId);
      await appendConversationTurn(userId, "assistant", text);

      const parsed = JSON.parse(text);
      const history = await getConversationHistory(userId);

      res.setHeader("Set-Cookie", [
        `responseId=${responseId}; Path=/; HttpOnly`,
        `chatUserId=${encodeURIComponent(userId)}; Path=/; HttpOnly`,
      ]);

      return res.status(200).json([
        ...formatHistoryForClient(history.slice(0, -1)),
        {
          id: responseId,
          role: "assistant",
          timestamp: new Date().toLocaleString(),
          content: parsed.prompt || text,
          suggestions: parsed.suggestions || [],
          tripDetails: parsed.trip_details || null,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      return res
        .status(500)
        .json({ error: "Failed to get response from assistant" });
    }
  }

  if (req.method === "DELETE") {
    const userId = req.cookies.chatUserId;

    if (userId) {
      await clearStoredResponseId(userId);
      await clearConversationHistory(userId);
    }

    res.setHeader("Set-Cookie", [
      "responseId=; Path=/; HttpOnly; Max-Age=0",
      "chatUserId=; Path=/; HttpOnly; Max-Age=0",
    ]);

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
