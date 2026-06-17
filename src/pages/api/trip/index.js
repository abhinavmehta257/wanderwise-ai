import { getTrips } from '../../../../lib/trips';
import connectDB from '../../../../db/db';
import TripDetails from '../../../../model/itinerary';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const tripDetails = await getTrips({ page, limit });
    console.log("tripDetails:", tripDetails);
    res.status(200).json(tripDetails);
    return;
  }

  if (req.method === 'POST') {
    await connectDB();

    try {
      const { slug, numberOfDays, location, title, destination_image_url, data } = req.body;

      const newTrip = new TripDetails({
        slug,
        numberOfDays,
        location,
        title,
        destination_image_url,
        data,
      });
      
      await newTrip.save();

      res.status(201).json({ success: true, trip: newTrip });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
