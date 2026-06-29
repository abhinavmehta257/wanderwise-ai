export const TRIP_PROGRESS_PHASES = [
  { step: "Collecting places to see...", progress: 18 },
  { step: "Gathering trip details...", progress: 32 },
  { step: "Planning activities & dining...", progress: 24 },
  { step: "Adding local tips & customs...", progress: 41 },
  { step: "Estimating your budget...", progress: 35 },
  { step: "Building your daily schedule...", progress: 52 },
  { step: "Polishing your itinerary...", progress: 44 },
  { step: "Almost ready...", progress: 58 },
];

export const TRIP_PROGRESS_LABELS = TRIP_PROGRESS_PHASES.map((phase) =>
  phase.step.replace(/\.\.\.$/, "")
);

const HIDDEN_STEP_PATTERNS = [/hero image/i, /creating your hero/i];

export function isVisibleProgressStep(step) {
  if (!step) return false;
  return !HIDDEN_STEP_PATTERNS.some((pattern) => pattern.test(step));
}

export function formatPhaseStep(step, destination) {
  if (!destination) return step;
  if (step === "Collecting places to see...") {
    return `Collecting places to see in ${destination}...`;
  }
  return step;
}
