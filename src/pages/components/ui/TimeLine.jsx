import { useState } from "react";
import Activities from "./activity";

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate.toDateString();
  newDate.ge
}

const Timeline = ({itinerary, start_date}) => {
  const [openDay, setOpenDay] = useState(null);
  const toggleDay = (day) => {
    setOpenDay(openDay === day ? null : day); // Toggle open/close
  };
  
  
  return (
    <ol class="relative border-s border-gray-200 dark:border-gray-700">  
      {itinerary.map((item, index) => (
        <li class="ms-4">
            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <h3 class="text-lg font-semibold text-black text-[20px]">{item.title}</h3>
            <time class="mb-1 text-sm font-normal leading-none text-black">{addDays(start_date, index)}</time>
            <Activities activities={item.activities} />
        </li>
      ))}
    </ol>
  );
};

export default Timeline;
