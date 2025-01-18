import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Loader from './Loader';

const BlogCard = ({ trip }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Add null check before accessing trip properties
    if (!trip) {
        return null;
    }
    
    const handleClick = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await router.push(`/trip/${trip.slug}`);
        } catch (error) {
            console.error('Navigation failed:', error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <div 
                onClick={handleClick}
                className={`relative grid rounded-lg cursor-pointer transition-all duration-300 ${
                    isLoading ? 'opacity-50' : ''
                }`}
            >
                <div className="rounded-md">
                    <img 
                        src={trip.destination_image_url || ''} 
                        className='rounded-md w-full h-full object-cover aspect-square' 
                        alt={trip.title || 'Trip image'} 
                    />
                </div>
                <div className="mt-4">
                    <h6 className="text-slate-800 text-[18px] font-bold">
                        {trip.title}
                    </h6>
                    <p className="text-slate-600 leading-normal font-light text-[14px]">
                        {trip.description}
                    </p>
                    <div className="mt-1">
                        <p className="text-[#737373] font-light text-[14px]">
                            {trip.createdAt}
                        </p>
                    </div>
                </div>
            </div>
            {isLoading && <Loader />}
        </>
    );
};

// Add PropTypes validation
BlogCard.propTypes = {
    trip: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        destination_image_url: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired
    })
};

export default BlogCard;
