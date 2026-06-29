import Head from 'next/head';
import Itinerary from '../components/Itinerary';
import Hero from '../components/hero';
import Skeleton from '../components/ui/Skeleton';
import NavBar from '../components/ui/NavBar';
import BlogCard from '../components/ui/BlogCard';
import Footer from '../components/ui/Footer';
import GenerateTripFab from '../components/ui/GenerateTripFab';

const TripPage = ({ trip, relatedTrips = [] }) => {
  if (!trip) {
    return <Skeleton />;
  }

  const { description, start_date } = trip.data.overview;
  const { itinerary, local_tips, budget_breakdown } = trip.data;
  const { destination_image_url, title } = trip;

  return (
    <>
      <Head>
        <title>{title ? title : ''} | Wanderwise</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={destination_image_url} />
        <meta property="og:url" content={`https://wanderwise.vercel.app/trip/${trip.slug}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@wanderwise" />
        <meta name="twitter:creator" content="@wanderwise" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9744648621612550"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content="ca-pub-9744648621612550" />
      </Head>
      <NavBar />
      <div className="w-full bg-white pb-[32px]">
        <div className="md:w-[50%] lg:w-[50%] sm:w-[100%] mx-auto">
          <div className="">
            <div className="h-full ">
              <div className="w-full">
                <img
                  src={destination_image_url}
                  alt=""
                  className="w-full sm:h-[200px] md:h-[400px] lg:h-[400px] object-cover md:rounded-lg lg:rounded-lg"
                />
              </div>
              <div className="px-[32px]">
                <Hero
                  description={description}
                  title={title}
                  destination_image_url={destination_image_url}
                  creator={trip.creator}
                />
                <Itinerary
                  itinerary={itinerary}
                  start_date={start_date}
                  budget_breakdown={budget_breakdown}
                  local_tips={local_tips}
                />
              </div>
            </div>
          </div>
          <div className="py-[32px] px-[36px] bg-[#f5f5f5] rounded-lg mt-[24px]">
            <h1 className="text-black text-[24px] font-bold">Other fun trips</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
              {relatedTrips.length > 0 ? (
                relatedTrips.map((relatedTrip) => (
                  <BlogCard key={relatedTrip.slug} trip={relatedTrip} />
                ))
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <GenerateTripFab />
    </>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const connectDB = (await import('../../../db/db')).default;
    const TripDetails = (await import('../../../model/itinerary')).default;
    const { getTrips } = await import('../../../lib/trips');

    await connectDB();

    const [trip, relatedTrips] = await Promise.all([
      TripDetails.findOne({ slug: params.slug }).lean(),
      getTrips({ page: 1, limit: 3, excludeSlug: params.slug }),
    ]);

    if (!trip) {
      return { notFound: true };
    }

    return {
      props: {
        trip: JSON.parse(JSON.stringify(trip)),
        relatedTrips,
      },
    };
  } catch (error) {
    console.error('Failed to load trip:', error.message);
    return { notFound: true };
  }
}

export default TripPage;
