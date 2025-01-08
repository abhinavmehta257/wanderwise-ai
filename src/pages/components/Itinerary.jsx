import React from 'react';
import PropTypes from 'prop-types';
import Timeline from './ui/TimeLine';


const Itinerary = ({itinerary, start_date}) => {
    return (
        <div className='border-t' >
            <h1 className='pt-[28px] pb-[16px] text-[28px] text-[black]'>Itinerary</h1>
           < Timeline itinerary={itinerary} start_date={start_date}/>
        </div>
    );
};

export default Itinerary;
