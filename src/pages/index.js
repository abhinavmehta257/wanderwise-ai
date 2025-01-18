import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import BlogCard from './components/ui/BlogCard';
import Skeleton from './components/ui/Skeleton';
import Head from 'next/head';
import NavBar from './components/ui/NavBar';
import Footer from './components/ui/Footer';


const Index = () => {
    const [trips, setTrips] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 9; // Number of items per page

    const fetchTrips = async () => {
        try {
            const response = await axios.get(`/api/trip?page=${page}&limit=${limit}`);
            const newTrips = response.data;
            
            if (newTrips.length < limit) {
                setHasMore(false);
            }
            
            setTrips(prev => [...prev, ...newTrips]);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Error fetching trips:', error);
            setHasMore(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    return (
        <div className='bg-white'>
        <Head>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9744648621612550"
                crossorigin="anonymous"></script>
            <meta name="google-adsense-account" content="ca-pub-9744648621612550"></meta>
            <title>All Trips | Wanderwise</title>
        </Head>
            <NavBar />
            <div className='flex align-center justify-center px-[32px] mb-[32px]'>
                <div className=' h-full  md:w-[70%] lg:w-[70%] sm:w-[100%]'>
                    <div className='text-center'>
                        <h1 className='text-[#333333] text-3xl font-bold'>All Trips</h1>
                        <p className='text-[#333333]'>See all the trips we have planned.</p>
                    </div>
                    <InfiniteScroll
                        dataLength={trips.length}
                        next={fetchTrips}
                        hasMore={hasMore}
                        loader={<Skeleton />}
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'
                    >
                        {trips.map((trip) => (
                            <BlogCard key={trip.id} trip={trip} />
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
            <Footer />
        </div>

    );
};


export default Index;
