import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { server } from "../server";

// Custom CSS for slide transition, heading animation, underline animation, and unique sort by
const bannerStyles = `
.slick-slide {
  transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
  opacity: 0;
  transform: scale(0.8);
}
.slick-slide.slick-active {
  opacity: 1;
  transform: scale(1);
}
.animate-heading {
  animation: slideIn 0.8s ease-out forwards;
}
@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.underline-animation {
  position: relative;
  display: inline-block;
}
.underline-animation::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(to right,rgb(2, 133, 255),rgb(10, 66, 223));
  animation: growLine 0.6s ease-out forwards 0.8s;
}
@keyframes growLine {
  0% {
    width: 0;
  }
  100% {
    width: 60%;
  }
}
.sort-unique {
  background: white;
  transition: all 0.3s ease-in-out;
}
.sort-unique:hover {
  transform: translateY(-2px);
}
.animate-bounce-subtle {
  animation: bounceSubtle 2s infinite ease-in-out;
}
@keyframes bounceSubtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(2px);
  }
}
`;

const ProductsPage = () => {
  window.scrollTo(0, 0);
  const [searchParams] = useSearchParams();
  const subCategoryData = searchParams.get("subcategory");
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [banners, setBanners] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Fetch category banners from API
  useEffect(() => {
    if (categoryData && subCategoryData) {
      fetchCategoryBanners(categoryData, subCategoryData);
    }
  }, [categoryData, subCategoryData]);

  const fetchCategoryBanners = async (category, subCategory) => {
    try {
      const response = await axios.get(
        `${server}/product-banner/get-product-banners?category=${category}&subCategory=${subCategory}`
      );

      if (response.data.success && response.data.productBanners.length > 0) {
        setBanners(response.data.productBanners[0].banners || []);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error("Failed to fetch category banners:", error);
      setBanners([]);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let filteredProducts = [...allProducts];
    if (subCategoryData) {
      filteredProducts = filteredProducts.filter(
        (i) => i.subCategory === subCategoryData
      );
    }
    if (minPrice !== "") {
      filteredProducts = filteredProducts.filter(
        (i) => Number(i.originalPrice) >= Number(minPrice)
      );
    }
    if (maxPrice !== "") {
      filteredProducts = filteredProducts.filter(
        (i) => Number(i.originalPrice) <= Number(maxPrice)
      );
    }
    if (sortOrder === "lowToHigh") {
      filteredProducts.sort(
        (a, b) => Number(a.originalPrice) - Number(b.originalPrice)
      );
    } else if (sortOrder === "highToLow") {
      filteredProducts.sort(
        (a, b) => Number(b.originalPrice) - Number(a.originalPrice)
      );
    }
    setData(filteredProducts);
  }, [allProducts, subCategoryData, minPrice, maxPrice, sortOrder]);

  // Slider settings (matched with Hero component)
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: false,
  };

  // Filter out null or empty banners
  const validBanners = banners.filter((banner) => banner !== null && banner !== "");

  // Updated heading text logic
  const getHeadingText = () => {
    if (subCategoryData) {
      return subCategoryData.charAt(0).toUpperCase() + subCategoryData.slice(1).toLowerCase();
    }
    return "All Products";
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />

          {/* Banner Section - Matched with Hero component */}
          {validBanners.length > 0 && (
            <div className="relative w-full">
              {/* Inject custom styles */}
              <style>{bannerStyles}</style>

              <div className="relative w-full max-h-[90vh] overflow-hidden mt-4">
                {validBanners.length === 1 ? (
                  <div className="relative w-full">
                    <img
                      src={validBanners[0]}
                      alt="Banner"
                      className="w-full h-auto max-h-[90vh] object-contain object-center"
                    />
                  </div>
                ) : (
                  <Slider {...settings} className="w-full">
                    {validBanners.map((banner, index) => (
                      <div key={index} className="relative w-full">
                        <img
                          src={banner}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-auto max-h-[90vh] object-contain object-center"
                        />
                      </div>
                    ))}
                  </Slider>
                )}
              </div>

            </div>
          )}

          {/* Product Section */}
          <div className={`${styles.section} mt-5`} id="products-grid">
            {/* Flex container for heading and sort dropdown */}
            <div className="flex justify-between items-center mb-6">
              {/* Heading with animated underline */}
              <h1 className="text-2xl md:text-3xl font-bold text-black capitalize underline-animation">
                {getHeadingText()}
              </h1>

              {/* Sort By Dropdown */}
              <div className="flex items-center relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="sort-unique border-none bg-white p-2 pl-4 pr-8 rounded-full shadow-md text-gray-700 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-indigo-50 appearance-none relative cursor-pointer z-10"
                >
                  <option value="">Sort By</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
                <span className="absolute right-3 pointer-events-none z-10">
                  <svg
                    className="w-4 h-4 text-gray-500 animate-bounce-subtle"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg" // SVG namespace from W3C
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-200/20 to-indigo-300/20 blur-sm -z-10"></div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12">
              {data.length > 0 ? (
                data.map((i, index) => <ProductCard data={i} key={index} />)
              ) : (
                <div className="col-span-2 w-full flex justify-center items-center mt-10">
                  <h1 className="text-center text-[20px] font-semibold text-gray-600">
                    Coming Soon...
                  </h1>
                </div>
              )}
            </div>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;