// filepath: /workspaces/wanderwise-ai/src/pages/api/trip.js
import connectDB from '../../../../db/db.js';
import TripDetails from '../../../../model/itinerary';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const limit = parseInt(req.query.limit) || 10;
    const trips = await TripDetails.find({}).limit(limit).lean();
    const tripDetails = trips.map(trip => ({
      slug: trip.slug,
      title: trip.title,
      destination_image_url: trip.destination_image_url,
      description: trip.data.overview.description,
      createdAt: new Date(trip.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
    
    res.status(200).json(tripDetails);
  }

  if (req.method === 'POST') {
    try {
      const { slug, numberOfDays, location, title, destination_image_url, data } = req.body;

      // Create a new trip
      const newTrip = new TripDetails({
        slug,
        numberOfDays,
        location,
        title,
        destination_image_url,
        data,
      });

      // Save the trip to the database
      await newTrip.save();

      res.status(201).json({ success: true, trip: newTrip });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}