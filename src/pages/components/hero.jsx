import React from 'react';
import PropTypes from 'prop-types';


const Hero = ({ destination ,description, trip_duration, destination_image_url}) => {
    return (
        <div className='text-[black] py-[16px]'>
            <div className='rounded-lg w-full '>
                <img src={destination_image_url} alt="" className='w-full sm:h-[200px] md:h-[400px] lg:h-[400px] object-cover rounded-md' srcset="" />
            </div>
            <div className='mt-4'>
                <div className='py-2'>
                    <h1 className='text-3xl font-bold'>{destination}</h1>
                    <p className='text-xl text-[#8C9094]'>{trip_duration}</p>
                </div>
                <p className='text-[18px] leading-6'>{description}</p>
            </div>
        </div>
    );
};

export default Hero;
