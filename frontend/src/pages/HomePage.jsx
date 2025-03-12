import React, { useState, useEffect } from 'react';
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";
import Footer from "../components/Layout/Footer";
import { ImgUrl } from '../static/data';
import { FaArrowLeft, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';
import HomePageCategories from './HomePageCatagories/HomePageCategories';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentReviewIndex((prevIndex) =>
        prevIndex >= reviews.length - 2 ? 0 : prevIndex + 2
      );
    }, 5000);
    return () => clearInterval(autoSlide);
  }, []);

  const reviews = [
    {
      name: "Asfer",
      text: "I bought a Puma gas heater, and it’s the best! Keeps my room warm even in harsh winters. You can trust Puma for quality products.",
    },
    {
      name: "Sana Malik",
      text: "The Puma electric fan I ordered is amazing. Super quiet and efficient. I received exactly what I ordered. Highly recommend!",
    },
    {
      name: "Zain Gondal",
      text: "Puma gas stoves are fantastic! Very durable and easy to use. I’ve been using mine for months with no issues. Great brand!",
    },
    {
      name: "Ria Umer",
      text: "Puma’s gas geyser is top-notch. Installation was easy, and it provides hot water instantly. Best purchase I’ve made this year!",
    },
    {
      name: "Ayesha Siddiqui",
      text: "I purchased a Puma electric kettle, and it’s a game-changer. Boils water so quickly and looks stylish too. 100% recommended!",
    },
    {
      name: "Fatima Noor",
      text: "The Puma electric blender works perfectly for my kitchen needs. Smooth blending and sturdy build. Puma never disappoints!",
    },
  ];

  const handlePrevReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === 0 ? Math.floor((reviews.length - 1) / 2) * 2 : prevIndex - 2
    );
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex >= reviews.length - 2 ? 0 : prevIndex + 2
    );
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-white">
          <img src={ImgUrl} alt="Loading..." className="animate-zoom" />
        </div>
      ) : (
        <>
          <Header activeHeading={1} />
          <Hero />
          <HomePageCategories/>
          <BestDeals />
          <Events />
          <FeaturedProduct />

          {/* Customer Reviews Section */}
          <div className="py-12 px-5 sm:px-10 bg-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              What Our Customers Say
              <span className="block w-20 h-1 bg-red-600 mt-3 mx-auto"></span>
            </h2>
            <div className="relative flex items-center justify-center">
              {/* Left Arrow */}
              <button
                onClick={handlePrevReview}
                className="absolute left-0 sm:-left-12 text-red-600 hover:text-red-700 transition duration-300 z-10"
              >
                <FaArrowLeft size={28} />
              </button>

              {/* Reviews (Show 2 at a time) */}
              <div className="flex justify-center gap-8 w-full max-w-5xl">
                {reviews.slice(currentReviewIndex, currentReviewIndex + 2).map((review, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 max-w-md"
                  >
                    <div className="flex items-center mb-4">
                      {/* Dummy Avatar */}
                      <div
                        className="w-14 h-14 rounded-full mr-4 flex items-center justify-center text-white text-xl font-bold"
                        style={{ backgroundColor: '#D3D3D3' }}
                      >
                        {review.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{review.name}</h3>
                        <p className="text-sm text-gray-500">Verified Customer</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaQuoteLeft className="text-gray-300 mr-3 mt-1" size={24} />
                      <p className="text-gray-700 text-base leading-relaxed">{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNextReview}
                className="absolute right-0 sm:-right-12 text-red-600 hover:text-red-700 transition duration-300 z-10"
              >
                <FaArrowRight size={28} />
              </button>
            </div>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};

export default HomePage;