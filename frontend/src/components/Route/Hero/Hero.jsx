import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import styles from "../../../styles/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { server } from "../../../server";

// Custom CSS for slide transition
const bannerStyles = `
.slick-slide {
  transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
  opacity: 0;
  transform: scale(0.8);
}
.slick-slide.slick-active {
  opacity: 1;
  transform: scale(1);
}transform: rotateY(0deg);
}
`;

const Hero = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(${server}/banner/get-home-banner, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setImages(response.data.banners || []);
          console.log("Banners:", response.data.banners);
        } else {
          console.warn("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error(
          "Error fetching banners:",
          error.response ? error.response.data : error.message
        );
      }
    };

    const checkApiHealth = async () => {
      try {
        const response = await axios.get(${server}/health);
        console.log("✅ API Health Check:", response.data);
      } catch (error) {
        console.error(
          "❌ API Health Check Failed:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchBanners();
    checkApiHealth();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600, // Matches transition duration
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: false, // Using custom slide effect instead
  };

  const validImages = images.filter((image) => image !== null && image !== "");

  if (validImages.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Inject custom styles */}
      <style>{bannerStyles}</style>

      {/* Banner Section */}
      <div className="relative w-full max-h-[90vh] overflow-hidden">
        {validImages.length === 1 ? (
          <div className="relative w-full">
            <img
              src={validImages[0]}
              alt="Banner"
              className="w-full h-auto max-h-[90vh] object-contain object-center"
            />
          </div>
        ) : (
          <Slider {...settings} className="w-full">
            {validImages.map((image, index) => (
              <div key={index} className="relative w-full">
                <img
                  src={image}
                  alt={Slide ${index + 1}}
                  className="w-full h-auto max-h-[90vh] object-contain object-center"
                />
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Attractive Line Design */}
      <div className="w-full py-4 bg-white">
        <div className="relative w-full h-8 sm:h-12 md:h-16 overflow-hidden">
          <svg
            className="absolute w-full h-full text-red-600"
            preserveAspectRatio="none"
            viewBox="0 0 1440 100"
            fill="currentColor"
          >
            <path d="M0,50 Q360,150 720,50 T1440,50 L1440,100 L0,100 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;