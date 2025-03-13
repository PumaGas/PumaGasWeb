import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  // Function to handle navigation with page reload
  const handleNavigation = () => {
    const url = isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`;
    window.location.href = url; // Forces a full page reload
  };

  return (
    <div className="w-full h-[370px] bg-white rounded-lg shadow-md p-4 relative cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-end"></div>
      <div onClick={handleNavigation}>
        <img
          src={`${data.images && data.images[0]?.url}`}
          alt={data.name}
          className="w-full h-[170px] object-contain rounded-t-lg"
        />
      </div>

      <div className="mt-2">
        <h5 className="text-sm text-gray-500">{data.shop.name}</h5>

        <div onClick={handleNavigation}>
          <h4 className="pb-2 font-semibold text-gray-800 text-[16px] hover:text-teal-600 transition-colors duration-200">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {data.discountPrice && data.discountPrice < data.originalPrice ? (
                <>
                  <h4 className="text-lg font-bold text-teal-600">
                    {data.discountPrice} Rs
                  </h4>
                  <h4 className="text-sm text-red-500 line-through">
                    {data.originalPrice} Rs
                  </h4>
                </>
              ) : (
                <h4 className="text-lg font-bold text-teal-600">
                  {data.originalPrice} Rs
                </h4>
              )}
            </div>
            <span
              className={`font-medium text-[15px] ${data.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
            >
              {data.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>

      {/* Icons */}
      <div className="absolute top-3 right-3 flex flex-col space-y-2">
        {click ? (
          <AiFillHeart
            size={22}
            className="cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={() => removeFromWishlistHandler(data)}
            color="red"
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            className="cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={() => addToWishlistHandler(data)}
            color="#333"
            title="Add to wishlist"
          />
        )}
        <AiOutlineEye
          size={22}
          className="cursor-pointer hover:scale-110 transition-transform duration-200"
          onClick={() => setOpen(!open)}
          color="#333"
          title="Quick view"
        />
      </div>

      {/* Quick View Modal */}
      {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
    </div>
  );
};

export default ProductCard;