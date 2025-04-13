import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [click, setClick] = useState(false);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  
  // Determine the effective price (discountPrice if less than originalPrice, otherwise originalPrice)
  const effectivePrice = data.discountPrice && data.discountPrice < data.originalPrice 
    ? data.discountPrice 
    : data.originalPrice;

  const [orderDetails, setOrderDetails] = useState({
    customerName: "",
    customerPhoneNumber: "+92", // Prefill with +92
    customerEmail: "",
    amount: effectivePrice || "", // Use effective price
    location: "",
  });

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerPhoneNumber") {
      const cleanedValue = value.replace(/[^0-9+]/g, ""); // Remove non-numeric except +
      if (
        cleanedValue === "" || // Allow empty input
        (cleanedValue.startsWith("+92") && cleanedValue.length <= 13) // +92 + 10 digits = 13 chars
      ) {
        setOrderDetails({ ...orderDetails, [name]: cleanedValue });
      }
    } else {
      setOrderDetails({ ...orderDetails, [name]: value });
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+923[0-4][0-9]{8}$/; // Matches +923XXXXXXXXXX (10 digits after +923)
    return phoneRegex.test(phoneNumber);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(orderDetails.customerPhoneNumber)) {
      toast.error("Please enter a valid Pakistani phone number (e.g., +923001234567)");
      return;
    }

    try {
      const response = await axios.post(`${server}/order/create-order`, {
        customerEmail: orderDetails.customerEmail,
        customerName: orderDetails.customerName,
        customerPhoneNumber: orderDetails.customerPhoneNumber,
        location: orderDetails.location,
        orderDetails: {
          productId: data._id,
          productName: data.name,
          quantity: 1, // Assuming quantity is 1 since no field exists; adjust if needed
          price: effectivePrice, // Use effective price
          totalAmount: effectivePrice * 1, // Assuming quantity is 1
        },
        orderStock: data.stock || 10, // Use actual stock if available
        sellerId: data.shop._id,
      });

      console.log("Order Placed:", response.data.order);
      toast.success("Order placed successfully! Check your email.");
      setOrderFormOpen(false);
      setOrderDetails({
        customerName: "",
        customerPhoneNumber: "+92",
        customerEmail: "",
        amount: effectivePrice || "",
        location: "",
      });
    } catch (error) {
      console.error("Order Error:", error.response?.data?.message || error.message);
      toast.error("Failed to place order: " + (error.response?.data?.message || "Server error"));
    }
  };

  const handleMessageSubmit = async () => {
    try {
      const response = await axios.get(`${server}/shop/get-first-seller-phone`);
      console.log("API Response:", response.data);

      if (!response.data.success || !response.data.phoneNumber) {
        toast.error("Unable to retrieve seller phone number!");
        return;
      }

      const phoneNumber = response.data.phoneNumber;
      console.log("Fetched Phone Number:", phoneNumber);

      // Use effective price in WhatsApp message
      console.log("discription", data.description);
      const message = `Hello, I am interested in your product: ${data.name} \n Price: ${effectivePrice}Rs \n and the discription is \n ${data.description} \n `;
      const whatsappUrl = `https://wa.me/+92${phoneNumber}?text=${encodeURIComponent(message)}`;
      console.log("Generated WhatsApp URL:", whatsappUrl);

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

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center px-4">
          <div className="w-full max-w-[600px] h-auto bg-white rounded-md shadow-md relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50 cursor-pointer text-gray-600 hover:text-red-500 transition"
              onClick={() => setOpen(false)}
            />

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <img
                  src={data.images && data.images[0]?.url}
                  alt="Product"
                  className="w-full h-auto rounded-md shadow-sm"
                />
                <div className="flex mt-3 items-center">
                  <img
                    src={data.shop?.shopAvatar?.url || data.images[0]?.url}
                    alt="Shop Avatar"
                    className="w-[50px] h-[50px] rounded-full mr-2 border border-gray-300"
                  />
                  <h3 className="text-sm font-medium text-gray-700">{data.shop.name}</h3>
                </div>
              </div>

              <div className="w-full md:w-1/2 pt-5 px-2">
                <h1 className="text-lg md:text-xl font-bold text-gray-800">{data.name}</h1>
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

                {/* Price Display */}
                <div className="mt-3 flex items-center space-x-2">
                  {data.discountPrice && data.discountPrice < data.originalPrice ? (
                    <>
                      <h4 className="text-lg font-semibold text-teal-600">
                        {data.discountPrice}Rs
                      </h4>
                      <h4 className="text-sm text-gray-500 line-through">
                        {data.originalPrice}Rs
                      </h4>
                    </>
                  ) : (
                    <h4 className="text-lg font-semibold text-teal-600">
                      {data.originalPrice}Rs
                    </h4>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-3 mt-6">
                  <button
                    className="w-full md:w-auto bg-teal-600 py-2 px-4 rounded-md text-white hover:bg-teal-700 transition shadow-sm"
                    onClick={() => setOrderFormOpen(true)}
                  >
                    Place Order
                  </button>
                  <button
                    className="w-full md:w-auto flex items-center justify-center bg-[#25D366] py-2 px-4 rounded-md text-white hover:bg-[#1ebe52] transition shadow-sm"
                    onClick={handleMessageSubmit}
                  >
                    Send Message <AiOutlineWhatsApp className="ml-1" />
                  </button>
                </div>

                {/* Wishlist Icon */}
                <div className="mt-4">
                  {click ? (
                    <AiFillHeart
                      size={25}
                      className="cursor-pointer hover:scale-110 transition"
                      onClick={() => removeFromWishlistHandler(data)}
                      color="red"
                      title="Remove from wishlist"
                    />
                  ) : (
                    <AiOutlineHeart
                      size={25}
                      className="cursor-pointer hover:scale-110 transition"
                      onClick={() => addToWishlistHandler(data)}
                      color="#333"
                      title="Add to wishlist"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Order Form Modal */}
      {orderFormOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Place Your Order</h2>
            <button
              onClick={() => setOrderFormOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
            >
              <RxCross1 size={20} />
            </button>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Your Name"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  onChange={handleInputChange}
                  value={orderDetails.customerName}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  name="customerPhoneNumber"
                  placeholder="+923001234567"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  onChange={handleInputChange}
                  value={orderDetails.customerPhoneNumber}
                  required
                  pattern="^\+923[0-4][0-9]{8}$"
                  title="Please enter a valid Pakistani phone number (e.g., +923001234567)"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Format: +923XXXXXXXXXX (e.g., +923001234567)
                </p>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  placeholder="Your Email"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  onChange={handleInputChange}
                  value={orderDetails.customerEmail}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Amount</label>
                <input
                  type="text"
                  name="amount"
                  placeholder="Amount"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100"
                  onChange={handleInputChange}
                  value={orderDetails.amount}
                  required
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Your Location"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  onChange={handleInputChange}
                  value={orderDetails.location}
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setOrderFormOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition shadow-sm"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsCard;