import Head from 'next/head';
import NavBar from './components/ui/NavBar';
import Footer from './components/ui/Footer';
import TripList from './components/TripList';
import TripSearchBar from './components/ui/TripSearchBar';
import GenerateTripFab from './components/ui/GenerateTripFab';

const LIMIT = 9;

const Index = ({ initialTrips = [], initialHasMore = false }) => {
  return (
    <div className="bg-white">
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9744648621612550"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content="ca-pub-9744648621612550" />
        <title>Explore Destinations | Wanderwise</title>
      </Head>
      <NavBar />
      <div className="flex align-center justify-center px-[32px] mb-[32px]">
        <div className=" h-full  md:w-[70%] lg:w-[70%] sm:w-[100%]">
          <div className="text-center">
            <h1 className="text-[#333333] text-3xl font-bold">Explore Destinations</h1>
            <p className="text-[#333333]">Discover trips to unique destinations we have planned.</p>
          </div>
          <div className="mt-6 max-w-xl mx-auto">
            <TripSearchBar />
          </div>
          <TripList
            initialTrips={initialTrips}
            initialHasMore={initialHasMore}
            limit={LIMIT}
            uniqueDestinations
          />
        </div>
      </div>
      <Footer />
      <GenerateTripFab />
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const { getUniqueDestinationTrips } = await import('../../lib/trips');
    const { trips: initialTrips, hasMore: initialHasMore } = await getUniqueDestinationTrips({
      page: 1,
      limit: LIMIT,
    });

    return {
      props: {
        initialTrips,
        initialHasMore,
      },
    };
  } catch (error) {
    console.error('Failed to load trips:', error.message);

    return {
      props: {
        initialTrips: [],
        initialHasMore: false,
      },
    };
  }
}

export default Index;
