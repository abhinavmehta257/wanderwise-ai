export function validateApiKey(req, res) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return false;
  }
  return true;
}