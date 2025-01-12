import Head from 'next/head';
import TripDetails from '../../../model/itinerary';

import Itinerary from '../components/Itinerary';
import Hero from '../components/hero';
import Skeleton from '../components/ui/Skeleton';
import connectDB from '../../../db/db';
import NavBar from '../components/ui/NavBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../components/ui/BlogCard';
import { Footer } from '../components/ui/Footer';

const TripPage = ({ trip }) => {
  if (!trip) {
    return (<Skeleton />);
  }
  const {destination, trip_duration, description, start_date} = trip.data.overview;
  const {itinerary, local_tips, budget_breakdown} = trip.data;
  const {destination_image_url,title, } = trip;

  const [trips, setTrips] = useState(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axios.get('/api/trip?limit=3');
                setTrips(response.data);
                console.log('Trips:', response.data);
                
            } catch (error) {
                console.error('Error fetching trips:', error);
            }
        };

        fetchTrips();
    }, []);

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
     <meta name="google-adsense-account" content="ca-pub-9744648621612550"></meta>
    </Head>
    <NavBar/>
    <div className="w-full bg-white pb-[32px]">
      <div className="md:w-[80%] lg:w-[80%] sm:w-[100%] mx-auto">
      {trip ? <div className=''>
        <div className="h-full ">
            <div className='w-full'>
                <img src={destination_image_url} alt="" className='w-full sm:h-[200px] md:h-[400px] lg:h-[400px] object-cover md:rounded-lg lg:rounded-lg' srcset="" />
            </div>
            <div className="px-[32px]">
              <Hero description={description} title={title} destination_image_url={destination_image_url}/>
              <Itinerary itinerary={itinerary} start_date={start_date} budget_breakdown={budget_breakdown} local_tips={local_tips} />
            </div>
        </div>
      </div> : <Skeleton/>}
        <div className="py-[32px] px-[36px] bg-[#f5f5f5] rounded-lg mt-[24px]">
          <h1 className='text-black text-[24px] font-bold'>Other fun trips</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
            {trips ? trips.map((trip) => (<BlogCard key={trip.id} trip={trip} />)) : <Skeleton/>}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
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