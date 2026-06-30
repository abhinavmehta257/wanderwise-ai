export const SITE_NAME = 'Wanderwise';
export const SITE_TAGLINE = 'AI-powered travel itinerary planning';
export const TWITTER_HANDLE = '@wanderwise';
export const DEFAULT_DESCRIPTION =
  'Discover unique destinations and plan your perfect trip with AI-powered itineraries from Wanderwise.';

export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export function buildCanonicalUrl(path = '') {
  const base = getBaseUrl();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized === '/' ? '' : normalized}`;
}

function buildOgQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

export function buildDefaultOgImageUrl({ title, description } = {}) {
  return `${getBaseUrl()}/api/og${buildOgQuery({ title, description })}`;
}

export function buildTripOgImageUrl({ title, location, days, image, pathname } = {}) {
  return `${getBaseUrl()}/api/og/trip${buildOgQuery({ title, location, days, image, pathname })}`;
}
