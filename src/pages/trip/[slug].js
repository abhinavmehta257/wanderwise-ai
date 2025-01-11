import Head from 'next/head';
import TripDetails from '../../../model/itinerary';

import Itinerary from '../components/Itinerary';
import Hero from '../components/hero';
import Skeleton from '../components/ui/Skeleton';
import connectDB from '../../../db/db';
import NavBar from '../components/ui/NavBar';

const TripPage = ({ trip }) => {
  // const { slug } = router.query;
  // const { slug } = router.query;

  if (!trip) {
    return (<Skeleton />);
  }
  const {destination, trip_duration, description, start_date} = trip.data.overview;
  const {itinerary} = trip.data;
  const {destination_image_url,title} = trip;
  return (
    <>
    <Head>
      <title>{title ? title : ""} | Wanderwise</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={destination_image_url} />
      <meta property="og:url" content={`https://wanderwise.vercel.app/trip/${trip.slug}`} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@wanderwise" />
      <meta name="twitter:creator" content="@wanderwise" />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9744648621612550"
        crossorigin="anonymous"></script>
    </Head>
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
  await connectDB();
  const trip = await TripDetails.findOne({ slug: params.slug }).lean();

  return {
    props: {
      trip: trip ? JSON.parse(JSON.stringify(trip)) : null,
    },
  };
}

export default TripPage;