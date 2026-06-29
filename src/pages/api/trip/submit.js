import connectDB from '../../../../db/db';
import TripDetails from '../../../../model/itinerary';
import redis from '../../../../utils/redis';
import { normalizeLocation, buildLocationQuery } from '../../../../utils/location';
import { resolveTravelPlace } from '../../../../utils/placeSearch';
import { processTripGeneration } from '../../../../utils/processTripGeneration';
import { initTripJob } from '../../../../utils/tripJobStatus';

const BUDGET_TIERS = ["budget", "mid-range", "luxury"];

function sanitizeHandle(handle) {
  if (!handle) return '';
  return handle.replace(/^@+/, '').trim();
}

async function validateSubmission(body) {
  const destinationInput = body.destination?.trim();
  const numberOfDays = parseInt(body.numberOfDays, 10);

  if (!destinationInput) {
    return { error: 'Destination is required' };
  }

  const resolvedPlace = await resolveTravelPlace(destinationInput);
  if (!resolvedPlace) {
    return {
      error:
        'Please choose a city or travel destination (e.g. Manali, Mumbai) — not a street address.',
    };
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

  const budgetTier = body.budgetTier?.trim() || 'mid-range';
  if (!BUDGET_TIERS.includes(budgetTier)) {
    return { error: 'Invalid budget tier' };
  }

  const budgetAmountRaw = body.budgetAmount;
  const budgetAmount =
    budgetAmountRaw === undefined || budgetAmountRaw === null || budgetAmountRaw === ''
      ? undefined
      : parseFloat(budgetAmountRaw, 10);

  if (budgetAmount !== undefined && (Number.isNaN(budgetAmount) || budgetAmount <= 0)) {
    return { error: 'Budget amount must be greater than 0' };
  }

  const budgetCurrency = body.budgetCurrency?.trim() || undefined;
  if (budgetAmount !== undefined && !budgetCurrency) {
    return { error: 'Currency is required when a budget amount is provided' };
  }

  const budget = {
    tier: budgetTier,
    ...(budgetAmount !== undefined
      ? { amount: budgetAmount, currency: budgetCurrency }
      : {}),
  };

  return {
    destination: normalizeLocation(resolvedPlace),
    numberOfDays,
    datePreference,
    startDate,
    endDate,
    budget,
    creator: {
      name: body.creatorName?.trim() || undefined,
      instagramHandle: sanitizeHandle(body.instagramHandle) || undefined,
    },
  };
}

async function triggerTripGeneration(payload) {
  await processTripGeneration(payload);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const validated = await validateSubmission(req.body);
  if (validated.error) {
    return res.status(400).json({ success: false, error: validated.error });
  }

  const instagramUserId =
    req.body.instagramUserId?.trim() ||
    `web:${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const {
    destination,
    numberOfDays,
    datePreference,
    startDate,
    endDate,
    budget,
    creator,
  } = validated;

  const pendingPayload = {
    user_id: instagramUserId,
    destination,
    number_of_days: numberOfDays,
    date_preference: datePreference,
    start_date: startDate,
    end_date: endDate,
    budget,
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

  await initTripJob(instagramUserId, {
    destination,
    numberOfDays,
  });

  res.status(200).json({ success: true, jobId: instagramUserId });

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
