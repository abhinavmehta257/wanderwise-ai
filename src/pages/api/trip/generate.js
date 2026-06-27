import { validateApiKey } from '../../../middleware/authMiddleware';
import { createTrip } from '../../../../utils/openAi';
import {
  getBaseUrl,
  sendActionQuickReply,
  sendButtonTemplate,
  sendMessage,
} from '../../../../utils/sendMessage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!validateApiKey(req, res)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const {
    user_id,
    destination,
    number_of_days,
    date_preference,
    start_date,
    end_date,
    creator,
    force = false,
  } = req.body;

  if (!user_id || !destination || !number_of_days) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await createTrip(user_id, {
      location: destination,
      numberOfDays: number_of_days,
      datePreference: date_preference || 'flexible',
      startDate: start_date,
      endDate: end_date,
      creator,
      force,
    });

    const tripUrl = `${getBaseUrl()}/trip/${result.slug}`;

    if (result.isExisting && !force) {
      const creatorName = result.creator?.name;
      const byLine = creatorName ? ` by ${creatorName}` : ' by someone else';

      await sendMessage(
        user_id,
        `This trip to ${destination} (${number_of_days} days) was already planned${byLine}.`
      );
      await sendButtonTemplate(
        user_id,
        tripUrl,
        'Check out the existing trip below.',
        'View trip'
      );
      await sendActionQuickReply(
        user_id,
        'Want a fresh itinerary just for you?',
        [{ title: 'Generate my own', payload: 'GENERATE_OWN' }]
      );
    } else {
      await sendButtonTemplate(
        user_id,
        tripUrl,
        `Your trip to ${destination} is ready!`,
        'View trip'
      );
    }

    return res.status(200).json({
      message: 'Trip processed',
      slug: result.slug,
      isExisting: result.isExisting,
    });
  } catch (error) {
    console.error('Trip generation error:', error);
    await sendMessage(
      user_id,
      'We encountered an error generating your trip. Please try again later.'
    );
    return res.status(500).json({ message: 'Trip generation failed' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
  maxDuration: 300,
};
