import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProduct = () => {
  const { allProducts } = useSelector((state) => state.products);

  return (
    <div>
      <div className={${styles.section}}>
        <div className={${styles.heading} relative flex justify-center items-center py-4}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500  tracking-wide drop-shadow-lg">
            Featured Products
          </h1>
          {/* Animated Underline */}
          <div className="absolute bottom-0 w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-[15px] sm:gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {allProducts && allProducts.length !== 0 && (
            <>
              {allProducts.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;