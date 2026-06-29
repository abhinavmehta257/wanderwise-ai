import { searchTrips } from '../../../../lib/trips';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const q = req.query.q?.trim();
  if (!q || q.length < 2) {
    return res.status(200).json([]);
  }

  try {
    const suggestions = await searchTrips({ q });
    return res.status(200).json(suggestions);
  } catch (error) {
    console.error('Trip search error:', error);
    return res.status(500).json({ message: 'Failed to search trips' });
  }
}
