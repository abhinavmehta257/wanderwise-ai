import { searchTravelPlaces } from "../../../../utils/placeSearch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const query = req.query.q?.trim();
  if (!query || query.length < 2) {
    return res.status(200).json([]);
  }

  try {
    const suggestions = await searchTravelPlaces(query);
    return res.status(200).json(suggestions);
  } catch (error) {
    console.error("Places search error:", error);
    return res.status(500).json({ message: "Failed to search locations" });
  }
}
