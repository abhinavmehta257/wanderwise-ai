import Head from 'next/head';
import NavBar from '@/pages/components/ui/NavBar';
import Footer from '@/pages/components/ui/Footer';

const LegalPageLayout = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#333333]">
      <Head>
        <title>{title} | Wanderwise</title>
        <meta name="description" content={`${title} for Wanderwise AI travel itinerary service.`} />
      </Head>
      <NavBar />
      <main className="flex-1 px-6 py-10 md:px-12 lg:px-24">
        <article className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-[#181F23] mb-2">{title}</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>
          )}
          <div className="space-y-6 text-[15px] leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#181F23] [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-[#181F23] [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-[#21BCBE] [&_a]:underline">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPageLayout;
