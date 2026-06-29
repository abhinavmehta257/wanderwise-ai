import redis from "./redis";
import {
  TRIP_PROGRESS_PHASES,
  formatPhaseStep,
} from "./tripProgressPhases";

const JOB_TTL_SECONDS = 3600;
const jobKey = (jobId) => `trip_job:${jobId}`;

export async function initTripJob(jobId, { destination, numberOfDays }) {
  const status = {
    status: "queued",
    step: "Starting your trip plan...",
    progress: 5,
    phase: 0,
    destination,
    numberOfDays,
    slug: null,
    isExisting: false,
    error: null,
    updatedAt: new Date().toISOString(),
  };

  await redis.set(jobKey(jobId), JSON.stringify(status), {
    ex: JOB_TTL_SECONDS,
  });

  return status;
}

export async function updateTripJob(jobId, patch) {
  const current = await getTripJob(jobId);
  if (!current) return null;

  if (current.status === "complete" && patch.status !== "complete") {
    return current;
  }

  const next = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  await redis.set(jobKey(jobId), JSON.stringify(next), {
    ex: JOB_TTL_SECONDS,
  });

  return next;
}

export async function getTripJob(jobId) {
  if (!jobId) return null;

  const raw = await redis.get(jobKey(jobId));
  if (!raw) return null;

  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

export async function completeTripJob(jobId, { slug, isExisting = false }) {
  return updateTripJob(jobId, {
    status: "complete",
    step: isExisting ? "Found an existing trip for you!" : "Your trip is ready!",
    progress: 100,
    phase: TRIP_PROGRESS_PHASES.length,
    slug,
    isExisting,
  });
}

export async function failTripJob(jobId, error) {
  return updateTripJob(jobId, {
    status: "error",
    step: "Something went wrong",
    progress: 100,
    error: error?.message || "Trip generation failed",
  });
}

export function startProgressTicker(jobId, destination) {
  let index = 0;

  const tick = () => {
    const phase = TRIP_PROGRESS_PHASES[index % TRIP_PROGRESS_PHASES.length];

    updateTripJob(jobId, {
      status: "generating",
      step: formatPhaseStep(phase.step, destination),
      progress: phase.progress,
      phase: index % TRIP_PROGRESS_PHASES.length,
    }).catch((error) => {
      console.error("Progress ticker error:", error);
    });

    index += 1;
  };

  tick();
  const intervalId = setInterval(tick, 3200);

  return () => clearInterval(intervalId);
}
