import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineWhatsApp,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { addToWishlist, removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import { ImgUrl } from "../../static/data";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhoneNumber: "+92",
    location: "",
    quantity: 1,
  });
  const [searchParams] = useSearchParams();
  const isEvent = searchParams.get("isEvent");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist, dispatch]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${server}/shop/get-first-seller-phone`);
      if (!response.data.success || !response.data.phoneNumber) {
        toast.error("Unable to retrieve seller phone number!");
        return;
      }
      console.log("discription", data.description);
      const price = isEvent === "true" || data.discountPrice ? data.discountPrice : data.originalPrice;
      const phoneNumber = response.data.phoneNumber;
      const message = `Hello, I am interested in your product: ${data.name}. Here is the image: ${data.images[0]?.url} \n Price: ${price}Rs \n and discription: \n ${data.description}`;
      const whatsappUrl = `https://wa.me/+92${phoneNumber}?text=${encodeURIComponent(message)}`;
      const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        toast.info("Opening WhatsApp in current tab...");
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error("Error fetching seller phone number:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  const toggleOrderForm = () => {
    setShowOrderForm(!showOrderForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerPhoneNumber") {
      const cleanedValue = value.replace(/[^0-9+]/g, "");
      if (
        cleanedValue === "" ||
        (cleanedValue.startsWith("+92") && cleanedValue.length <= 13)
      ) {
        setOrderData({ ...orderData, [name]: cleanedValue });
      }
    } else {
      setOrderData({ ...orderData, [name]: value });
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+923[0-4][0-9]{8}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(orderData.customerPhoneNumber)) {
      toast.error("Please enter a valid Pakistani phone number (e.g., +923001234567)");
      return;
    }

    const payload = {
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      customerPhoneNumber: orderData.customerPhoneNumber,
      location: orderData.location,
      orderDetails: {
        productId: data._id,
        productName: data.name,
        quantity: parseInt(orderData.quantity, 10),
        price: isEvent === "true" || data.discountPrice ? data.discountPrice : data.originalPrice,
      },
      orderStock: data.stock || 10,
      sellerId: data.shop._id,
    };

    try {
      const response = await axios.post(`${server}/order/create-order`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      toast.success("Order placed successfully! Check your email.");
      setShowOrderForm(false);
      setOrderData({
        customerName: "",
        customerEmail: "",
        customerPhoneNumber: "+92",
        location: "",
        quantity: 1,
      });
    } catch (error) {
      console.error("Order Error:", error.response?.data || error.message);
      toast.error(
        "Failed to place order: " + (error.response?.data?.message || "Server error")
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen animate-fade-in">
      {data ? (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Image Section */}
              <div className="space-y-4 animate-slide-up">
                <img
                  src={`${data && data.images[select]?.url}`}
                  alt={data.name}
                  className="w-full h-96 object-contain rounded-lg transform transition duration-300 hover:scale-105"
                />
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {data?.images.map((i, index) => (
                    <img
                      key={index}
                      src={`${i?.url}`}
                      alt=""
                      className={`h-20 w-20 object-cover rounded-md cursor-pointer transform transition duration-200 hover:scale-110 ${
                        select === index ? "border-2 border-teal-500 shadow-md" : ""
                      }`}
                      onClick={() => setSelect(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Product Info Section */}
              <div className="space-y-6 animate-slide-up animation-delay-200">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{data.name}</h1>
                <ul className="space-y-2 text-gray-600 text-lg">
  {data.description.split("\n").map((point, index) => (
    <li
      key={index}
      className="flex items-start space-x-2 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span className="text-teal-600 font-bold">•</span>
      <span className="leading-relaxed">{point.replace(/^-\s*/, "")}</span>
    </li>
  ))}
</ul>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-semibold text-teal-600 animate-pulse">
                    {isEvent === "true" || data.discountPrice
                      ? `${data.discountPrice} Rs`
                      : `${data.originalPrice} Rs`}
                  </span>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      data.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {data.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={toggleOrderForm}
                    className="bg-teal-600 text-white px-6 py-3 rounded-md flex items-center hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Place Order <AiOutlineShoppingCart className="ml-2" />
                  </button>
                  <button
                    onClick={handleMessageSubmit}
                    className="bg-[#128C7E] text-white px-6 py-3 rounded-md flex items-center hover:bg-[#0e6b5e] transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Contact Seller <AiOutlineWhatsApp className="ml-2" />
                  </button>
                  <button
                    onClick={() =>
                      click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)
                    }
                    className="text-gray-600 hover:text-red-500 transition-all duration-300 transform hover:scale-110"
                  >
                    {click ? (
                      <AiFillHeart size={30} color="red" />
                    ) : (
                      <AiOutlineHeart size={30} />
                    )}
                  </button>
                </div>

                {/* Shop Info */}
                <div className="flex items-center space-x-4 animate-slide-up animation-delay-400">
                  <img
                    src={data?.shop?.avatar?.url || ImgUrl}
                    alt={data.shop.name}
                    className="w-12 h-12 rounded-full border-2 border-teal-500 transform transition duration-300 hover:scale-110"
                  />
                  <span className="text-lg font-medium text-gray-800 hover:text-teal-600 transition-colors duration-200">
                    {data.shop.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="p-6 border-t bg-gray-50 animate-fade-in animation-delay-600">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Details</h2>
              <ul className="space-y-3 text-gray-700">
                {data.description.split("\n").map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-2 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-teal-600 font-bold">•</span>
                    <span className="leading-relaxed">
                      {point.replace(/^-\s*/, "")} {/* Remove leading "- " if present */}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Form Modal */}
          {showOrderForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Place Your Order</h2>
                <form onSubmit={handleOrderSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Your Name"
                      value={orderData.customerName}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      placeholder="Your Email"
                      value={orderData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="customerPhoneNumber"
                      placeholder="+923001234567"
                      value={orderData.customerPhoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      required
                      pattern="^\+923[0-4][0-9]{8}$"
                      title="Please enter a valid Pakistani phone number (e.g., +923001234567)"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Format: +923XXXXXXXXXX (e.g., +923001234567)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      value={orderData.quantity}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Delivery Location"
                      value={orderData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={toggleOrderForm}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Submit Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 animate-fade-in">
          <h2 className="text-2xl font-semibold text-gray-700">Product Not Found</h2>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;