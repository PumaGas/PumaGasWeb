import React from "react";
import Header from "../../../components/Layout/Header"; // Adjust path as needed
import Footer from "../../../components/Layout/Footer"; // Already included
import styles from "../../../styles/styles";

const StoreLocation = () => {
  // Example store details (replace with your actual store info)
  const storeDetails = {
    name: "Your Shop Name",
    address: "123 Example Street, City, Country",
    phone: "+92 123 456 7890",
    email: "support@yourshop.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509368!2d144.95373531531692!3d-37.81627997975166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d9f0a4b0b0e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1698765432100!5m2!1sen!2sus" // Example embed URL; replace with your store's
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header /> {/* Adjust activeHeading for "Store Location" in your navbar */}

      {/* Main Content */}
      <div className={`${styles.section} py-12 px-4 md:px-8 flex-grow`}>
        <h1 className="text-3xl font-bold text-center mb-8 text-[#000000b7]">
          Our Store Location
        </h1>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          {/* Store Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{storeDetails.name}</h2>
            <p className="text-gray-600 mb-2">
              <strong>Address:</strong> {storeDetails.address}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Phone:</strong> {storeDetails.phone}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {storeDetails.email}
            </p>
          </div>

          {/* Google Map */}
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <iframe
              src={storeDetails.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location Map"
            ></iframe>
          </div>

          {/* Directions Link */}
          <div className="mt-6 text-center">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=123+Example+Street,+City,+Country"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StoreLocation;