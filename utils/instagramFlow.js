import redis from "./redis";
import { processTripGeneration } from "./processTripGeneration";
import {
  getBaseUrl,
  sendButtonTemplate,
  sendMessage,
  sendQuickReply,
} from "./sendMessage";

const ACTIONS = {
  GENERATE_TRIP: "GENERATE_TRIP",
  BROWSE_TRIPS: "BROWSE_TRIPS",
  GENERATE_OWN: "GENERATE_OWN",
};

const GENERATE_LABELS = new Set([
  "generate a trip",
  "generate trip",
  "generate",
]);

const BROWSE_LABELS = new Set(["browse trips", "browse"]);

const GENERATE_OWN_LABELS = new Set(["generate my own", "generate own"]);

const WELCOME_TEXT =
  "Welcome to Wanderwise! What would you like to do today?";

async function sendWelcomeMenu(userId) {
  try {
    await sendQuickReply(userId, WELCOME_TEXT, [
      "Generate a Trip",
      "Browse Trips",
    ]);
  } catch (error) {
    console.error("[instagram-flow:v2] quick reply failed, falling back to plain text:", error);
    await sendMessage(
      userId,
      `${WELCOME_TEXT}\n\nReply "Generate" to plan a trip or "Browse" to see existing trips.`
    );
  }
}

async function sendGenerateFormLink(userId) {
  const formUrl = `${getBaseUrl()}/generate?uid=${encodeURIComponent(userId)}`;

  await sendButtonTemplate(
    userId,
    formUrl,
    "Fill out this quick form and we'll plan your trip. It only takes a minute!",
    "Plan my trip"
  );
}

async function sendBrowseLink(userId) {
  const browseUrl = getBaseUrl();

  await sendButtonTemplate(
    userId,
    browseUrl,
    "Browse trips others have planned on Wanderwise.",
    "Browse trips"
  );
}

async function triggerTripGeneration(body) {
  await processTripGeneration(body);
}

async function handleGenerateOwn(userId) {
  const pendingRaw = await redis.get(`pending_trip:${userId}`);

  if (!pendingRaw) {
    await sendMessage(
      userId,
      "I couldn't find your previous trip request. Please fill out the form again."
    );
    await sendGenerateFormLink(userId);
    return;
  }

  const pending =
    typeof pendingRaw === "string" ? JSON.parse(pendingRaw) : pendingRaw;

  await sendMessage(
    userId,
    `Creating your own version of the ${pending.destination} trip. You'll receive the link shortly.`
  );

  triggerTripGeneration({
    ...pending,
    user_id: userId,
    force: true,
  }).catch(async (error) => {
    console.error("[instagram-flow:v2] force generate error:", error);
    await sendMessage(
      userId,
      "We encountered an error generating your trip. Please try again later."
    );
  });
}

function resolveAction(text, payload) {
  const normalizedPayload = payload?.toUpperCase();
  const normalizedText = text?.trim().toLowerCase();

  if (
    normalizedPayload === ACTIONS.GENERATE_TRIP ||
    GENERATE_LABELS.has(normalizedText)
  ) {
    return ACTIONS.GENERATE_TRIP;
  }

  if (
    normalizedPayload === ACTIONS.BROWSE_TRIPS ||
    BROWSE_LABELS.has(normalizedText)
  ) {
    return ACTIONS.BROWSE_TRIPS;
  }

  if (
    normalizedPayload === ACTIONS.GENERATE_OWN ||
    GENERATE_OWN_LABELS.has(normalizedText)
  ) {
    return ACTIONS.GENERATE_OWN;
  }

  return null;
}

export async function handleInstagramMessage(userId, text, payload) {
  const action = resolveAction(text, payload) || "welcome";

  console.log("[instagram-flow:v2] incoming DM", {
    userId,
    text,
    payload,
    action,
  });

  switch (action) {
    case ACTIONS.GENERATE_TRIP:
      await sendGenerateFormLink(userId);
      break;
    case ACTIONS.BROWSE_TRIPS:
      await sendBrowseLink(userId);
      break;
    case ACTIONS.GENERATE_OWN:
      await handleGenerateOwn(userId);
      break;
    default:
      await sendWelcomeMenu(userId);
      break;
  }
}
