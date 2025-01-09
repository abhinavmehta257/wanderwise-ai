
import Hero from "./components/hero";
import Itinerary from "./components/Itinerary";


export default function Home() {

 const {destination, trip_duration, description, start_date, end_date} = plan.overview;
  const {itinerary} = plan;
  return (
   <div className="px-[24px] bg-[white] h-full">
      <div className="py-[16px]">
        <Hero description={description} destination={destination} trip_duration={trip_duration}/>
      </div>
      <Itinerary itinerary={itinerary} start_date={start_date}/>
   </div>
  );
}
