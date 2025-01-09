import { useState } from "react";
import Activities from "./activity";

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate.toDateString();
}

const Timeline = ({itinerary, start_date}) => {
  const [openDay, setOpenDay] = useState(null);
  const toggleDay = (day) => {
    setOpenDay(openDay === day ? null : day); // Toggle open/close
  };
  
  
  return (
    <ol className="relative border-s border-gray-200 border-t-0 border-dashed ">  
      {itinerary ? itinerary.map((item, index) => (
        <li className="ms-4" key={index}>
            <div className="absolute w-3 h-3 bg-[#21BCBE] rounded-full mt-2 -start-1.5 border border-[#21BCBE]"></div>
            <h3 className="font-semibold text-black text-[20px]">{item.title}</h3>
            <time className="mb-1 text-sm font-normal leading-none text-black">{addDays(start_date, index)}</time>
            <Activities activities={item.activities} />
        </li>
      )) : null}
    </ol>
  );
};

export default Timeline;
