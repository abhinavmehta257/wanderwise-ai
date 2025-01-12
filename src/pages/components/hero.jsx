import React from 'react';
import PropTypes from 'prop-types';


const Hero = ({ title ,description, trip_duration, destination_image_url}) => {
    return (
            <div className='my-4 text-[black]'>
                <div className='py-2'>
                    <h1 className='text-3xl font-bold'>{title}</h1>
                    <p className='text-xl text-[#8C9094]'>{trip_duration}</p>
                </div>
                <p className='text-[18px] leading-6'>{description}</p>
            </div>
    );
};

export default Hero;
