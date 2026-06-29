import OpenAI from "openai";
import redis from "../redis";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

const DEFAULT_MODEL = "gpt-4.1";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function withUserLock(userId, fn) {
  const lockKey = `lock:${userId}`;

  for (let attempt = 0; attempt < 60; attempt++) {
    const acquired = await redis.set(lockKey, "1", { nx: true, ex: 120 });
    if (acquired) {
      try {
        return await fn();
      } finally {
        await redis.del(lockKey);
      }
    }
    await sleep(1000);
  }

  throw new Error(`Timed out waiting for response lock for user ${userId}`);
}

function getModel() {
  return process.env.OPENAI_MODEL || DEFAULT_MODEL;
}

export async function createResponse({
  instructions,
  input,
  schema,
  schemaName,
  previousResponseId,
  userId,
}) {
  const request = {
    model: getModel(),
    instructions,
    input,
    text: {
      format: {
        type: "json_schema",
        name: schemaName,
        strict: true,
        schema,
      },
    },
  };

  if (previousResponseId) {
    request.previous_response_id = previousResponseId;
  }

  const execute = async () => {
    const response = await openai.responses.create(request);
    const text = response.output_text;

    if (!text) {
      throw new Error("Responses API returned empty output");
    }

    return {
      text,
      responseId: response.id,
    };
  };

  if (userId) {
    return withUserLock(userId, execute);
  }

  return execute();
}

export async function getStoredResponseId(userId) {
  return redis.get(`response:${userId}`);
}

export async function setStoredResponseId(userId, responseId) {
  await redis.set(`response:${userId}`, responseId, { ex: 86400 });
}

export async function clearStoredResponseId(userId) {
  await redis.del(`response:${userId}`);
}

export async function getConversationHistory(userId) {
  const raw = await redis.get(`chat_history:${userId}`);
  if (!raw) return [];
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }
}

export async function appendConversationTurn(userId, role, content) {
  const history = await getConversationHistory(userId);
  history.push({
    role,
    content,
    timestamp: new Date().toISOString(),
  });
  await redis.set(`chat_history:${userId}`, JSON.stringify(history), {
    ex: 86400,
  });
}

export async function clearConversationHistory(userId) {
  await redis.del(`chat_history:${userId}`);
}
