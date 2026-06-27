import connectDB from '../../../../db/db';
import TripDetails from '../../../../model/itinerary';
import redis from '../../../../utils/redis';
import { verifyFormToken } from '../../../../utils/token';
import { normalizeLocation, buildLocationQuery } from '../../../../utils/location';
import { getBaseUrl } from '../../../../utils/sendMessage';

function sanitizeHandle(handle) {
  if (!handle) return '';
  return handle.replace(/^@+/, '').trim();
}

function validateSubmission(body) {
  const destination = body.destination?.trim();
  const numberOfDays = parseInt(body.numberOfDays, 10);

  if (!destination) {
    return { error: 'Destination is required' };
  }

  if (!numberOfDays || numberOfDays < 1 || numberOfDays > 30) {
    return { error: 'Number of days must be between 1 and 30' };
  }

  const datePreference = body.flexibleDates === false ? 'specific' : 'flexible';
  const startDate = body.startDate?.trim() || undefined;
  const endDate = body.endDate?.trim() || undefined;

  if (datePreference === 'specific' && !startDate) {
    return { error: 'Start date is required when dates are not flexible' };
  }

  return {
    destination: normalizeLocation(destination),
    numberOfDays,
    datePreference,
    startDate,
    endDate,
    creator: {
      name: body.creatorName?.trim() || undefined,
      instagramHandle: sanitizeHandle(body.instagramHandle) || undefined,
    },
  };
}

async function triggerTripGeneration(payload) {
  const response = await fetch(`${getBaseUrl()}/api/trip/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_SECRET_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Trip generate failed: ${response.status}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const tokenData = verifyFormToken(req.body.token);
  if (!tokenData) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired link. Please message us on Instagram again.',
    });
  }

  const validated = validateSubmission(req.body);
  if (validated.error) {
    return res.status(400).json({ success: false, error: validated.error });
  }

  const instagramUserId = tokenData.instagramUserId;
  const {
    destination,
    numberOfDays,
    datePreference,
    startDate,
    endDate,
    creator,
  } = validated;

  const pendingPayload = {
    user_id: instagramUserId,
    destination,
    number_of_days: numberOfDays,
    date_preference: datePreference,
    start_date: startDate,
    end_date: endDate,
    creator: {
      ...creator,
      instagramUserId,
    },
    force: false,
  };

  await redis.set(
    `pending_trip:${instagramUserId}`,
    JSON.stringify(pendingPayload),
    { ex: 86400 }
  );

  res.status(200).json({ success: true });

  try {
    await connectDB();
    const existing = await TripDetails.findOne({
      ...buildLocationQuery(destination),
      numberOfDays,
    });

    triggerTripGeneration({
      ...pendingPayload,
      existing_slug: existing?.slug,
    }).catch((error) => {
      console.error('Background trip generation error:', error);
    });
  } catch (error) {
    console.error('Submit handler error:', error);
  }
}
