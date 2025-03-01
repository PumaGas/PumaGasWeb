import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import styles from "../../../styles/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { server } from "../../../server";

const Hero = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${server}/banner/get-home-banner`);
        if (response.data.success) {
          setImages(response.data.banners); // ✅ Corrected API response handling
          console.log("Banners:", response.data.banners);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="relative w-full min-h-[70vh] 800px:min-h-[80vh]">
      {images.length > 1 ? (
        <Slider {...settings} className="w-full h-full">
          {images.map((image, index) => (
            <div key={index} className="relative w-full h-[70vh] 800px:h-[80vh]">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                <HeroContent />
              </div>
            </div>
          ))}
        </Slider>
      ) : images.length === 1 ? (
        <div className="relative w-full h-[70vh] 800px:h-[80vh]">
          <img
            src={images[0]}
            alt="Banner"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
            <HeroContent />
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[70vh] 800px:h-[80vh] flex items-center justify-center bg-gray-200">
          <h2 className="text-gray-500 text-2xl">No banners available</h2>
        </div>
      )}
    </div>
  );
};

// Separated Hero Content
const HeroContent = () => {
  return (
    <div className={`${styles.section} w-[90%] 800px:w-[60%] text-center`}>
      <h1 className="text-[35px] leading-[1.2] 800px:text-[60px] text-white font-[600] capitalize">
        Best Collection for <br /> Home Decoration
      </h1>
      <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-white">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
        assumenda? Quisquam itaque <br /> exercitationem labore vel, dolore
        quidem asperiores, laudantium temporibus soluta optio consequatur{" "}
        <br /> aliquam deserunt officia. Dolorum saepe nulla provident.
      </p>
      <Link to="/products" className="inline-block">
        <div className="mt-5 px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg">
          Shop Now
        </div>
      </Link>
    </div>
  );
};

export default Hero;
