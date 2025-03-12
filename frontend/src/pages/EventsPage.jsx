import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { getAllEvents } from "../redux/actions/event"; // Adjust path
import Footer from "../components/Layout/Footer";

const EventsPage = () => {
  window.scrollTo(0, 0);
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEvents()); // Fetch events on mount
  }, [dispatch]);

  console.log("isLoading:", isLoading, "allEvents:", allEvents);

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `}
      </style>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <Header activeHeading={5} />
          <div className="container mx-auto py-12 px-4">
            {allEvents && allEvents.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allEvents.map((event, index) => (
                  <div
                    key={index}
                    className="animate-fadeInUp"
                    style={{ animationDelay: ${index * 0.1}s }}
                  >
                    <EventCard active={true} data={event} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-gray-600 text-lg font-medium animate-pulse">
                No events available
              </p>
            )}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default EventsPage;