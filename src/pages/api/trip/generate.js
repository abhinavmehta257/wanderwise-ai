// src/pages/api/trip/generate.js
import { validateApiKey } from '../../../middleware/authMiddleware';
import { getGeneratedTrip } from '../../../../utils/openAi';
import { sendButtonTemplate, sendMessage } from '../../../../utils/sendMessage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Validate API key
  if (!validateApiKey(req, res)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { user_id, destination, number_of_days } = req.body;

  // Immediately send response to prevent timeout
  res.status(200).json({ message: 'Trip generation started' });

  try {
    // Generate trip asynchronously
    const slug = await getGeneratedTrip(user_id, destination, number_of_days);

    // Send the trip link to user once generated
    await sendButtonTemplate(
      user_id,
      `${process.env.NEXT_PUBLIC_BASE_URL}/trip/${slug}`,
      `${process.env.NEXT_PUBLIC_BASE_URL}/trip/${slug}`,
      "View Trip Details"
    );
  } catch (error) {
    console.error('Trip generation error:', error);
    // Send error message to user
    await sendMessage(
      user_id,
      "We encountered an error generating your trip. Please try again later."
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
  }
};