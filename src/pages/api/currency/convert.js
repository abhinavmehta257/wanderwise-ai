export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Missing from or to currency' });
  }

  if (from === to) {
    return res.status(200).json({ from, to, rate: 1 });
  }

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();

    if (data.result !== 'success' || !data.rates?.[to]) {
      return res.status(400).json({ error: 'Currency conversion not supported' });
    }

    return res.status(200).json({
      from,
      to,
      rate: data.rates[to],
    });
  } catch (error) {
    console.error('Currency conversion error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
}
