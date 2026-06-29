const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "WanderwiseAI/1.0 (trip planning app)";

const TRAVEL_PLACE_TYPES = new Set([
  "city",
  "town",
  "village",
  "hamlet",
  "municipality",
  "borough",
  "suburb",
  "neighbourhood",
  "quarter",
  "county",
  "state",
  "region",
  "island",
  "archipelago",
  "administrative",
]);

const EXCLUDED_PLACE_CLASSES = new Set([
  "building",
  "highway",
  "amenity",
  "shop",
  "tourism",
  "office",
  "historic",
  "railway",
  "aeroway",
]);

export function looksLikeStreetAddress(text) {
  const value = String(text || "").trim();
  if (!value) return false;

  if (/^\d+[\s,-]/.test(value)) return true;

  return /\b(street|st\.|road|rd\.|avenue|ave\.|lane|drive|dr\.|boulevard|blvd\.|highway|hwy|apt|suite|floor)\b/i.test(
    value
  );
}

export function isTravelPlaceResult(item) {
  if (!item) return false;

  if (EXCLUDED_PLACE_CLASSES.has(item.class)) {
    return false;
  }

  if (item.class === "place") {
    return TRAVEL_PLACE_TYPES.has(item.type) || item.type === "locality";
  }

  if (item.class === "boundary" && item.type === "administrative") {
    return true;
  }

  if (item.type === "administrative") {
    return true;
  }

  return false;
}

export function formatPlaceFromNominatim(item) {
  const address = item.address || {};
  const primary =
    item.name ||
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.municipality ||
    address.county ||
    address.state_district ||
    address.state;

  if (!primary) {
    return item.display_name.split(",").slice(0, 2).join(", ").trim();
  }

  const parts = [primary];
  const region = address.state || address.region;
  if (region && region !== primary) {
    parts.push(region);
  }
  if (address.country) {
    parts.push(address.country);
  }

  return parts.join(", ");
}

function toSuggestion(item) {
  const label = formatPlaceFromNominatim(item);
  return {
    id: String(item.place_id),
    label,
    value: label,
  };
}

async function fetchNominatim(params) {
  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim request failed: ${response.status}`);
  }

  return response.json();
}

export async function searchTravelPlaces(query, limit = 8) {
  const trimmed = query?.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    q: trimmed,
    format: "json",
    addressdetails: "1",
    limit: String(Math.max(limit * 2, 12)),
    featuretype: "settlement",
  });

  const results = await fetchNominatim(params);
  const seen = new Set();

  return results
    .filter(isTravelPlaceResult)
    .map(toSuggestion)
    .filter((suggestion) => {
      const key = suggestion.value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

export async function resolveTravelPlace(query) {
  const trimmed = query?.trim();
  if (!trimmed) return null;

  if (looksLikeStreetAddress(trimmed)) {
    return null;
  }

  const suggestions = await searchTravelPlaces(trimmed, 5);
  if (!suggestions.length) {
    return null;
  }

  const normalizedInput = trimmed.toLowerCase();
  const exactMatch = suggestions.find(
    (suggestion) =>
      suggestion.label.toLowerCase() === normalizedInput ||
      suggestion.label.toLowerCase().startsWith(`${normalizedInput},`)
  );

  return exactMatch?.value || suggestions[0].value;
}
