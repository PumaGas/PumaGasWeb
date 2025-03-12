import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { loadSeller } from "../../redux/actions/user";
import axios from "axios";
import { server } from "../../server";
import CountDown from "./CountDown";
import styles from "../../styles/styles";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    customerName: "",
    customerEmail: "",
    customerPhoneNumber: "+92",
    location: "",
    quantity: 1,
  });

  const handleMessageSubmit = async () => {
    try {
      const response = await axios.get(`${server}/shop/get-first-seller-phone`);
      if (!response.data.success || !response.data.phoneNumber) {
        toast.error("Unable to retrieve seller phone number!");
        return;
      }
      const phoneNumber = response.data.phoneNumber;
      const message = `Hello, I am interested in your product: ${data.name}. Here is the image: ${data.images[0]?.url} \n Price: ${data.discountPrice}Rs`;
      const whatsappUrl = `https://wa.me/+92${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error fetching seller phone number:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerPhoneNumber") {
      const cleanedValue = value.replace(/[^0-9+]/g, "");
      if (
        cleanedValue === "" ||
        (cleanedValue.startsWith("+92") && cleanedValue.length <= 13)
      ) {
        setOrderDetails({ ...orderDetails, [name]: cleanedValue });
      }
    } else {
      setOrderDetails({ ...orderDetails, [name]: value });
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+923[0-4][0-9]{8}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(orderDetails.customerPhoneNumber)) {
      toast.error("Please enter a valid Pakistani phone number (e.g., +923001234567)");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${server}/order/create-order`,
        {
          customerEmail: orderDetails.customerEmail,
          customerName: orderDetails.customerName,
          customerPhoneNumber: orderDetails.customerPhoneNumber,
          location: orderDetails.location,
          orderDetails: {
            productId: data._id,
            productName: data.name,
            quantity: parseInt(orderDetails.quantity, 10),
            price: data.discountPrice,
          },
          orderStock: 10,
          sellerId: data.shop._id,
        },
        config
      );
      toast.success("Order placed successfully! Check your email.");
      setOrderFormOpen(false);
      setOrderDetails({
        customerName: "",
        customerEmail: "",
        customerPhoneNumber: "+92",
        location: "",
        quantity: 1,
      });
    } catch (error) {
      toast.error("Failed to place order: " + (error.response?.data?.message || "Server error"));
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulseGlow {
            0% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            70% {
              box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
          }
          .animate-pulseGlow {
            animation: pulseGlow 2s infinite;
          }
          @keyframes dealFlash {
            0%, 100% {
              background-color:rgb(255, 255, 255);
            }
            50% {
              background-color:rgb(135, 206, 235);
            }
          }
          .animate-dealFlash {
            animation: dealFlash 3s infinite;
          }
        `}
      </style>
      <div className={`w-full bg-white rounded-xl border border-gray-200 shadow-md ${active ? "unset" : "mb-6"} p-4 flex flex-col transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 max-h-[450px] relative overflow-hidden animate-dealFlash`}>
        {/* Deal Badge */}
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow animate-pulseGlow">
          Hot Deal
        </div>

        {/* Image Section */}
        <div className="w-full flex-shrink-0">
          <img
            src={`${data.images[0]?.url}`}
            alt=""
            className="w-full h-40 object-contain m-auto rounded-lg"
          />
        </div>

        {/* Content Section */}
        <div className="w-full flex flex-col justify-between flex-grow p-2">
          <div>
            <h2 className={`${styles.productTitle} text-center text-base font-bold text-gray-900 line-clamp-1`}>{data.name}</h2>
            <p className="text-center text-gray-600 text-sm line-clamp-2">{data.description}</p>
            <div className="w-full flex justify-center py-1">
              <CountDown data={data} />
            </div>
          </div>
          <div className="flex justify-center items-center py-2 gap-3">
            <h5 className="font-medium text-base text-red-500 line-through">{data.originalPrice}Rs</h5>
            <h5 className="font-extrabold text-xl text-green-600">{data.discountPrice}Rs</h5>
          </div>
          
          <div className="flex flex-row justify-center items-center gap-2 w-full mt-2 flex-wrap">
            <Link to={`/product/${data._id}?isEvent=true`} className="flex-shrink-0">
              <div className="bg-blue-600 text-white rounded-md text-center text-xs font-semibold py-1.5 px-3 transition-all duration-300 hover:bg-blue-700 animate-pulseGlow shadow">
                See Details
              </div>
            </Link>
            <div
              className="flex items-center justify-center bg-green-500 text-white rounded-md text-xs font-semibold py-1.5 px-3 cursor-pointer transition-all duration-300 hover:bg-green-600 animate-pulseGlow shadow flex-shrink-0"
              onClick={handleMessageSubmit}
            >
              <AiOutlineWhatsApp size={14} className="mr-1" /> Send
            </div>
            <div
              className="bg-orange-500 text-white rounded-md text-center text-xs font-semibold py-1.5 px-3 cursor-pointer transition-all duration-300 hover:bg-orange-600 animate-pulseGlow shadow flex-shrink-0"
              onClick={() => setOrderFormOpen(true)}
            >
              Place Order
            </div>
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {orderFormOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Place Your Order</h2>
            <button
              onClick={() => setOrderFormOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition"
            >
              <RxCross1 size={20} />
            </button>
            <form onSubmit={handleOrderSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Name</label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Your Name"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onChange={handleInputChange}
                  value={orderDetails.customerName}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  placeholder="Your Email"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onChange={handleInputChange}
                  value={orderDetails.customerEmail}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Phone Number</label>
                <input
                  type="text"
                  name="customerPhoneNumber"
                  placeholder="+923001234567"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onChange={handleInputChange}
                  value={orderDetails.customerPhoneNumber}
                  required
                  pattern="^\+923[0-4][0-9]{8}$"
                  title="Please enter a valid Pakistani phone number (e.g., +923001234567)"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Format: +923XXXXXXXXXX (e.g., +923001234567)
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Your Location"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onChange={handleInputChange}
                  value={orderDetails.location}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  placeholder="Quantity"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onChange={handleInputChange}
                  value={orderDetails.quantity}
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setOrderFormOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;