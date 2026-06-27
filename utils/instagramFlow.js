import redis from "./redis";
import { signFormToken } from "./token";
import {
  getBaseUrl,
  sendActionQuickReply,
  sendButtonTemplate,
  sendMessage,
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
  await sendActionQuickReply(userId, WELCOME_TEXT, [
    { title: "Generate a Trip", payload: ACTIONS.GENERATE_TRIP },
    { title: "Browse Trips", payload: ACTIONS.BROWSE_TRIPS },
  ]);
}

async function sendGenerateFormLink(userId) {
  const token = signFormToken(userId);
  const formUrl = `${getBaseUrl()}/generate?token=${encodeURIComponent(token)}`;

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
  const response = await fetch(`${getBaseUrl()}/api/trip/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_SECRET_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Trip generate failed: ${response.status}`);
  }
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
    console.error("Force generate error:", error);
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
  const action = resolveAction(text, payload);

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
