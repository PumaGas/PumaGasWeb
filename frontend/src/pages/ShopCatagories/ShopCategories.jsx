import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import { categoriesData, ImgUrl } from "../../static/data";
import { IoIosArrowForward } from "react-icons/io";
import Footer from "../../components/Layout/Footer";
import styles from "../../styles/styles";

const ShopCategories = () => {
  window.scrollTo(0, 0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header activeHeading={2} />
      <div className={`${styles.section} py-8 flex-grow`}>
        <div className="relative flex justify-center items-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-wide drop-shadow-lg animate-fade-in">
            Top Category
          </h1>
          {/* Animated Underline */}
          <div className="absolute bottom-0 w-24 h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {Array.isArray(categoriesData) ? (
            categoriesData.map((category, index) => (
              <div
                key={category.id}
                className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation
              >
                <div className="relative">
                  <img
                    src={category.image_Url || ImgUrl}
                    alt={category.title}
                    className="w-full h-48 object-contain transition-transform duration-300 hover:scale-110"
                  />
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className="w-full flex justify-between items-center py-3 px-4 bg-white text-[16px] text-[#000000b7] font-semibold hover:bg-gray-50 border-t border-gray-200 transition-colors duration-200"
                  >
                    {category.title || "Unnamed Category"}
                    <IoIosArrowForward size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[16px] text-[#000000b7] col-span-2">
              No categories available
            </p>
          )}
        </div>
      </div>

      {/* Modal for Subcategories */}
      {selectedCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full animate-fade-in-up">
            <h2 className="text-lg font-semibold text-[#000000b7] mb-4">
              {selectedCategory.title}
            </h2>
            <div>
              {Array.isArray(selectedCategory.subcategories) &&
              selectedCategory.subcategories.length > 0 ? (
                selectedCategory.subcategories.map((sub, index) => (
                  <Link
                    key={index}
                    to={`/products?category=${selectedCategory.title}&subcategory=${sub.title}`}
                    className="block py-2 px-3 text-[14px] text-[#00000091] hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    {sub.title}
                  </Link>
                ))
              ) : (
                <p className="py-2 px-3 text-[14px] text-[#00000091]">
                  No subcategories available
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
      {/* Inline Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShopCategories;