import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading} relative flex justify-center items-center py-4`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-wide drop-shadow-lg animate-fade-in">
    Combo Deals
  </h1>
  {/* Animated Underline with Blue Shades */}
  <div className="absolute bottom-0 w-24 h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 rounded-full animate-pulse" />
          </div>

          <div className="w-full grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 xl:gap-10">
            {allEvents && allEvents.length !== 0 ? (
              allEvents.map((event, index) => (
                <EventCard data={event} key={index} />
              ))
            ) : (
              <h4 className="text-center w-full py-4 text-gray-500">No Events have!</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;