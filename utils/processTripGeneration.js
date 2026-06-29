import { createTrip, validateItineraryComplete } from "./openAi";
import {
  getBaseUrl,
  sendActionQuickReply,
  sendButtonTemplate,
  sendMessage,
} from "./sendMessage";
import {
  completeTripJob,
  failTripJob,
  startProgressTicker,
  updateTripJob,
} from "./tripJobStatus";

function isInstagramUserId(userId) {
  return userId && !String(userId).startsWith("web:");
}

export async function processTripGeneration({
  user_id,
  destination,
  number_of_days,
  date_preference,
  start_date,
  end_date,
  budget,
  creator,
  force = false,
}) {
  const jobId = user_id;

  try {
    await updateTripJob(jobId, {
      status: "generating",
      step: "Collecting places to see...",
      progress: 12,
      phase: 0,
    });

    const stopProgressTicker = startProgressTicker(jobId, destination);

    let result;
    try {
      result = await createTrip(user_id, {
        location: destination,
        numberOfDays: number_of_days,
        datePreference: date_preference || "flexible",
        startDate: start_date,
        endDate: end_date,
        budget,
        creator,
        force,
        onProgress: async (step, progress, phase) => {
          await updateTripJob(jobId, {
            status: "generating",
            step,
            progress,
            ...(phase !== undefined ? { phase } : {}),
          });
        },
      });
    } finally {
      stopProgressTicker();
    }

    await completeTripJob(jobId, {
      slug: result.slug,
      isExisting: result.isExisting,
    });

    if (!isInstagramUserId(user_id)) {
      return result;
    }

    const tripUrl = `${getBaseUrl()}/trip/${result.slug}`;

    if (result.isExisting && !force) {
      const creatorName = result.creator?.name;
      const byLine = creatorName ? ` by ${creatorName}` : " by someone else";

      await sendMessage(
        user_id,
        `This trip to ${destination} (${number_of_days} days) was already planned${byLine}.`
      );
      await sendButtonTemplate(
        user_id,
        tripUrl,
        "Check out the existing trip below.",
        "View trip"
      );
      await sendActionQuickReply(user_id, "Want a fresh itinerary just for you?", [
        { title: "Generate my own", payload: "GENERATE_OWN" },
      ]);
    } else {
      await sendButtonTemplate(
        user_id,
        tripUrl,
        `Your trip to ${destination} is ready!`,
        "View trip"
      );
    }

    return result;
  } catch (error) {
    console.error("Trip generation failed:", error);
    await failTripJob(jobId, error);
    throw error;
  }
}

export { validateItineraryComplete };
