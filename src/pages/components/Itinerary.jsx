import React from 'react';
import PropTypes from 'prop-types';
import Timeline from './ui/TimeLine';


const Itinerary = ({itinerary, start_date, local_tips, budget_breakdown}) => {
    return (
        <div className='border-t text-black' >
            <h1 className='pt-[28px] pb-[16px] text-[28px] text-[black]'>Itinerary</h1>
            <Timeline itinerary={itinerary} start_date={start_date}/> 
           
           <div className='border-t mt-[28px]' >
                <div className='mb-2 mt-4'>
                    <h3 className="font-semibold">Customs</h3>
                    <ul className="list-disc ml-7 space-y-1">
                    {local_tips.customs ? local_tips.customs.map((custom, index) => (
                        <li key={index}>{custom}</li>
                    )): null}
                    </ul>
                </div>
                <div className='mb-2'>
                    <h3 className="font-semibold">Transportation</h3>
                    <p className='ml-2'>{local_tips.transportation}</p>
                </div>
                <div className='mb-2'>
                    <h3 className="font-semibold">Currency</h3>
                    <p className='ml-2'>{local_tips.currency}</p>
                </div>
                <div className='mb-2'>
                    <h3 className="font-semibold">Language</h3>
                    <p className='ml-2'>{local_tips.language}</p>
                </div>
            </div>
            <div className="space-y-2 border-t mt-[28px]">
                <h1 className='text-[24px] font-bold mt-4'>Budget</h1>
            {Object.entries(budget_breakdown).map(([key, value], index, array) => (
              <div key={key}>
                <div className="flex justify-between">
                  <span className="capitalize">{key}</span>
                  <span className="font-semibold">{value}</span>
                </div>
                {index < array.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </div>
        </div>
    );
};

export default Itinerary;
