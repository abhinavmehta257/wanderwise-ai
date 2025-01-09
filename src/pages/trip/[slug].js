import TripDetails from '../../../model/itinerary';

import Itinerary from '../components/Itinerary';
import Hero from '../components/hero';
import Skeleton from '../components/ui/Skeleton';

const TripPage = ({ trip }) => {
  // const { slug } = router.query;
  // const { slug } = router.query;

  if (!trip) {
    return (<Skeleton />);
  }
  const {destination, trip_duration, description, start_date} = trip.data.overview;
  const {itinerary} = trip.data;
  const {destination_image_url} = trip;
  return (
    <>
  {trip ? <div className='bg-white flex justify-center'>
    <div className="px-[24px] md:w-[70%] lg:w-[70%] sm:w-[100%] h-full">
        <div className="py-[16px]">
          <Hero description={description} destination={destination} trip_duration={trip_duration} destination_image_url={destination_image_url}/>
        </div>
        <Itinerary itinerary={itinerary} start_date={start_date}/>
    </div>
  </div> : <Skeleton/>}
  </>
  );
}

export async function getServerSideProps({ params }) {
  const trip = await TripDetails.findOne({ slug: params.slug }).lean();

  return {
    props: {
      trip: trip ? JSON.parse(JSON.stringify(trip)) : null,
    },
  };
}

export default TripPage;