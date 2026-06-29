import { useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import BlogCard from './ui/BlogCard';
import Skeleton from './ui/Skeleton';

const TripList = ({
  initialTrips = [],
  initialHasMore = false,
  limit = 9,
  uniqueDestinations = false,
}) => {
  const [trips, setTrips] = useState(initialTrips);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(2);

  const fetchTrips = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (uniqueDestinations) {
        params.set('uniqueDestinations', 'true');
      }

      const response = await axios.get(`/api/trip?${params.toString()}`);
      const payload = response.data;
      const newTrips = uniqueDestinations ? payload.trips : payload;
      const moreAvailable = uniqueDestinations ? payload.hasMore : newTrips.length >= limit;

      if (!moreAvailable) {
        setHasMore(false);
      }

      setTrips((prev) => [...prev, ...newTrips]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setHasMore(false);
    }
  };

  if (!trips.length) {
    return <p className="text-center text-[#333333] mt-8">No trips found.</p>;
  }

  return (
    <InfiniteScroll
      dataLength={trips.length}
      next={fetchTrips}
      hasMore={hasMore}
      loader={<Skeleton />}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
    >
      {trips.map((trip) => (
        <BlogCard key={trip.slug} trip={trip} />
      ))}
    </InfiniteScroll>
  );
};

export default TripList;
