const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const query = req.query.q?.trim();
  if (!query || query.length < 2) {
    return res.status(200).json([]);
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '0',
      limit: '8',
    });

    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        'User-Agent': 'WanderwiseAI/1.0 (trip planning app)',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim request failed: ${response.status}`);
    }

    const results = await response.json();
    const suggestions = results.map((item) => ({
      label: item.display_name,
      value: item.display_name,
    }));

    return res.status(200).json(suggestions);
  } catch (error) {
    console.error('Places search error:', error);
    return res.status(500).json({ message: 'Failed to search locations' });
  }
}
