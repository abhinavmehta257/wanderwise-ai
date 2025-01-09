import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

const BlogCard = ({ trip }) => {
    const router = useRouter();

    // Add null check before accessing trip properties
    if (!trip) {
        return null;
    }
    
    const handleClick = () => {
        router.push(`/trip/${trip.slug}`);
    };

    return (
        <div onClick={handleClick} className="relative grid bg-white rounded-lg cursor-pointer">
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
