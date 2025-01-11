import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../components/ui/BlogCard';
import Skeleton from '../components/ui/Skeleton';
import Head from 'next/head';


const Index = () => {
    const [trips, setTrips] = useState(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axios.get('/api/trip');
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
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9744648621612550"
        crossorigin="anonymous"></script>
        </Head>
            <div className='flex align-center justify-center bg-white h-[100vh] overflow-scroll p-[32px]'>
                <div className=' h-full  md:w-[70%] lg:w-[70%] sm:w-[100%]'>
                    <div className='text-center'>
                        <h1 className='text-[#333333] text-3xl font-bold'>All Trips</h1>
                        <p className='text-[#333333]'>See all the trips we have planned.</p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
                        {trips ? trips.map((trip) => (<BlogCard key={trip.id} trip={trip} />)) : <Skeleton/>}
                    </div>
                </div>
            </div>
        </>

    );
};


export default Index;
