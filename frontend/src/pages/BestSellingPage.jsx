import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const { allProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    setData(sortedData);
  }, [allProducts]);

  useEffect(() => {
    const header = document.querySelector('.fixed-header');
    const content = document.querySelector('.main-content');
    if (header && content) {
      const headerHeight = header.offsetHeight;
      content.style.paddingTop = ${headerHeight + 30}px;
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-white text-gray-900 relative">
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md fixed-header">
            <Header activeHeading={3} />
          </div>

          {/* Main Content */}
          <div className="pt-[150px] pb-12 relative main-content z-10">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-56 bg-gradient-to-b from-orange-100/30 via-blue-100/30 to-transparent"></div>

            <div className={${styles.section} relative}>
              {/* Title Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 animate-heading-pop">
                  <span className="inline-block animate-letter" style={{ animationDelay: "0s" }}>T</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "0.1s" }}>o</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "0.2s" }}>p</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "0.3s" }}> </span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "0.4s" }}>S</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "0.5s" }}>e</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "0.6s" }}>l</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "0.7s" }}>l</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "0.8s" }}>i</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "0.9s" }}>n</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "1s" }}>g</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "1.1s" }}> </span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "1.2s" }}>P</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "1.3s" }}>r</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "1.4s" }}>o</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "1.5s" }}>d</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "1.6s" }}>u</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "1.7s" }}>c</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "1.8s" }}>t</span>
                  <span className="inline-block animate-letter" style={{ animationDelay: "1.9s" }}>s</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mt-3 animate-fade-in-up">
                  Discover the Best in Gas & Electric Appliances
                </p>
                <div className="mt-4 h-1 w-24 bg-orange-400 mx-auto rounded-full animate-line-flow"></div>
              </div>

              {/* Grid Section */}
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8 mb-12">
                {data && data.length > 0 ? (
                  data.map((i, index) => (
                    <div
                      key={index}
                      className="animate-rise"
                      style={{ animationDelay: ${index * 0.1}s }}
                    >
                      <ProductCard data={i} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-lg col-span-full animate-fade-in">
                    No top sellers available right now.
                  </p>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
      {/* Custom Animations and Styles */}
      <style jsx>{`
        /* Animations */
        @keyframes headingPop {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes letterBounce {
          0% {
            opacity: 0;
            transform: translateY(-30px) scale(0.8);
          }
          60% {
            opacity: 1;
            transform: translateY(5px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes rise {
          0% {
            opacity: 0;
            transform: translateY(25px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes lineFlow {
          0% {
            width: 0;
            opacity: 0;
            background: #00b7eb;
          }
          50% {
            width: 6rem;
            opacity: 1;
            background: #ff6200;
          }
          100% {
            width: 6rem;
            opacity: 1;
            background: #00b7eb;
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-heading-pop {
          animation: headingPop 0.8s ease-out forwards;
        }
        .animate-letter {
          animation: letterBounce 0.5s ease-out forwards;
          display: inline-block;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
          animation-delay: 0.2s;
        }
        .animate-rise {
          animation: rise 0.6s ease-out forwards;
        }
        .animate-line-flow {
          animation: lineFlow 2s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        /* ProductCard Styling */
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .product-card::before {
          content: "🔥";
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 20px;
          color: #ff6200;
          opacity: 0.8;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: #00b7eb;
        }
        /* Responsive Adjustments */
        @media (max-width: 640px) {
          .grid {
            gap: 12px;
          }
          .text-4xl {
            font-size: 2.25rem;
          }
          .text-lg {
            font-size: 1rem;
          }
          .pt-[150px] {
            padding-top: 120px;
          }
        }
      `}</style>
    </>
  );
};

export default BestSellingPage;