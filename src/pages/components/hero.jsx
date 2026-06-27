import React from 'react';
import PropTypes from 'prop-types';


const Hero = ({ title, description, trip_duration, destination_image_url, creator }) => {
    const creatorName = creator?.name;
    const instagramHandle = creator?.instagramHandle?.replace(/^@+/, '');

    return (
            <div className='my-4 text-[black]'>
                <div className='py-2'>
                    <h1 className='text-3xl font-bold'>{title}</h1>
                    <p className='text-xl text-[#8C9094]'>{trip_duration}</p>
                    {(creatorName || instagramHandle) && (
                      <p className="mt-2 text-sm text-[#8C9094]">
                        Planned by{' '}
                        {creatorName ? (
                          <span className="font-medium text-[#181F23]">{creatorName}</span>
                        ) : null}
                        {creatorName && instagramHandle ? ' · ' : null}
                        {instagramHandle ? (
                          <a
                            href={`https://instagram.com/${instagramHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[#21BCBE] hover:underline"
                          >
                            @{instagramHandle}
                          </a>
                        ) : null}
                      </p>
                    )}
                </div>
                <p className='text-[18px] leading-6'>{description}</p>
            </div>
    );
};

export default Hero;
