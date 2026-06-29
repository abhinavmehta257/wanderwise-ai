import connectDB from '../db/db';
import TripDetails from '../model/itinerary';

export function formatTrip(trip) {
  return {
    slug: trip.slug,
    title: trip.title,
    destination_image_url: trip.destination_image_url,
    description: trip.data?.overview?.description ?? '',
    createdAt: new Date(trip.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}

export async function getTrips({ page = 1, limit = 9, excludeSlug = null } = {}) {
  await connectDB();

  const skip = (page - 1) * limit;
  const query = excludeSlug ? { slug: { $ne: excludeSlug } } : {};

  const trips = await TripDetails.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return trips.map(formatTrip);
}

export async function searchTrips({ q, limit = 8 } = {}) {
  await connectDB();
  const trimmed = q?.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'i');

  const trips = await TripDetails.find({
    $or: [{ title: regex }, { location: regex }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('slug title location numberOfDays destination_image_url')
    .lean();

  return trips.map((trip) => ({
    slug: trip.slug,
    title: trip.title,
    location: trip.location,
    numberOfDays: trip.numberOfDays,
    label: `${trip.title} — ${trip.location} (${trip.numberOfDays} days)`,
  }));
}
