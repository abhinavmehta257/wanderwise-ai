import { validateApiKey } from '../../../middleware/authMiddleware';
import { processTripGeneration } from '../../../../utils/processTripGeneration';
import { sendMessage } from '../../../../utils/sendMessage';

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
    budget,
    creator,
    force = false,
  } = req.body;

  if (!user_id || !destination || !number_of_days) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await processTripGeneration({
      user_id,
      destination,
      number_of_days,
      date_preference,
      start_date,
      end_date,
      budget,
      creator,
      force,
    });

    return res.status(200).json({
      message: 'Trip processed',
      slug: result.slug,
      isExisting: result.isExisting,
    });
  } catch (error) {
    console.error('Trip generation error:', error);

    if (user_id && !String(user_id).startsWith('web:')) {
      await sendMessage(
        user_id,
        'We encountered an error generating your trip. Please try again later.'
      );
    }

    return res.status(500).json({ message: 'Trip generation failed' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
  maxDuration: 300,
};
