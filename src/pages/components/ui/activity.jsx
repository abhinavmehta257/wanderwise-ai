import React from 'react';



const Activity = ({ activity }) => (
    <div className="p-2">
        <h3 className=" font-semibold text-black text-[16px] leading-5">{activity.time_of_day}: {activity.activity}</h3>
        <p className="text-[#333333] leading-5 mt-2">{activity.details}</p>
    </div>
);

const Activities = ({activities}) => (
    <div className="activities">
        {activities.map((activity, index) => (
            <Activity key={index} activity={activity} />
        ))}
    </div>
);

export default Activities;