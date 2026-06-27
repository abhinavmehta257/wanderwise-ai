export function normalizeLocation(location) {
  return location.toLowerCase().trim().replace(/\s+/g, " ");
}

export function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildLocationQuery(location) {
  const normalized = normalizeLocation(location);
  return {
    location: {
      $regex: new RegExp(`^${escapeRegex(normalized)}$`, "i"),
    },
  };
}
