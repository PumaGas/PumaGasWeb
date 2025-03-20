import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
  ImgUrl,
  BureauCer,
  PakStand,
  Swisso,
} from "../../static/data";
import { FaCheck, FaHeadset, FaCreditCard, FaTruck } from "react-icons/fa"; // Added icons for the banner

const Footer = () => {
  return (
    <div className="bg-[#000] text-white">
      {/* New Banner Section (Enhanced Icons) */}
<div className="flex justify-around items-center py-4 px-5 border-b border-gray-800">
  {/* Quality */}
  <div className="text-center">
    <FaCheck className="text-green-500 mx-auto mb-2" size={30} style={{ filter: 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.7))' }} />
    <h3 className="text-sm font-bold text-white">Quality</h3>
    <p className="text-xs text-gray-400">We aim to deliver quality products</p>
  </div>
  {/* 24/7 Support */}
  <div className="text-center">
    <FaHeadset className="text-orange-500 mx-auto mb-2" size={30} style={{ filter: 'drop-shadow(0 0 5px rgba(249, 115, 22, 0.7))' }} />
    <h3 className="text-sm font-bold text-white">24/7 Support</h3>
    <p className="text-xs text-gray-400">Available between 09AM-5PM</p>
  </div>
  {/* Fast Delivery */}
  <div className="text-center">
    <FaTruck className="text-orange-500 mx-auto mb-2" size={30} style={{ filter: 'drop-shadow(0 0 5px rgba(249, 115, 22, 0.7))' }} />
    <h3 className="text-sm font-bold text-white">Fast Delivery</h3>
    <p className="text-xs text-gray-400">Deliver within 2-3 business days</p>
  </div>
</div>

      {/* Main Sections (Unchanged) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:px-8 px-5 py-12">
        {/* Logo & Social Section */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-start">
          <img
            src={ImgUrl}
            alt="Puma Electric & Gas Appliances Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-4 cursor-pointer hover:scale-105 transition duration-300"
          />
          <p className="text-gray-300 text-sm sm:text-base max-w-[200px]">
          Sarfraz and Brother's <br /><br />Leader Of The Way <br />Puma Electric & Gas Appliances
          </p>
          <div className="flex items-center mt-6 gap-4">
            <Link
              to={"https://www.facebook.com/share/19CjYAbU6U/?mibextid=wwXIfr"}
              target="_blank"
              rel="noreferrer"
            >
              <AiFillFacebook
                size={25}
                className="cursor-pointer hover:text-teal-400 transition duration-300"
              />
            </Link>

            <Link to="https://twitter.com/" target="_blank" rel="noreferrer">
              <AiOutlineTwitter
                size={25}
                className="cursor-pointer hover:text-teal-400 transition duration-300"
              />
            </Link>
            <Link to="https://www.instagram.com/puma.gas?igsh=MXB3a2dlNXZkeG90OQ==" target="_blank" rel="noreferrer">
              <AiFillInstagram
                size={25}
                className="cursor-pointer hover:text-teal-400 transition duration-300"
              />
            </Link>
            <Link
              to="https://youtube.com/@pumagasofficial?si=A8XVXyiHE4D-lxdR"
              target="_blank"
              rel="noreferrer"
            >
              <AiFillYoutube
                size={25}
                className="cursor-pointer hover:text-teal-400 transition duration-300"
              />
            </Link>
          </div>
        </div>

        {/* Company Section */}
        <div className="text-center sm:text-start">
          <h1 className="mb-3 font-semibold text-lg text-teal-400">Company</h1>
          <ul className="space-y-2">
            {footerProductLinks.map((link, index) => (
              <li key={index}>
                <Link
                  className="text-gray-400 hover:text-teal-400 duration-300 text-sm cursor-pointer"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop Section */}
        <div className="text-center sm:text-start">
          <h1 className="mb-3 font-semibold text-lg text-teal-400">Shop</h1>
          <ul className="space-y-2">
            {footercompanyLinks.map((link, index) => (
              <li key={index}>
                <Link
                  className="text-gray-400 hover:text-teal-400 duration-300 text-sm cursor-pointer"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Section */}
        <div className="text-center sm:text-start">
          <h1 className="mb-3 font-semibold text-lg text-teal-400">Support</h1>
          <ul className="space-y-2">
            {footerSupportLinks.map((link, index) => (
              <li key={index}>
                <Link
                  className="text-gray-400 hover:text-teal-400 duration-300 text-sm cursor-pointer"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Certifications Section (Unchanged) */}
      <div className="border-t border-gray-800 py-6">
        <div className="flex justify-center items-center gap-6 sm:gap-8 px-5">
          <img
            src={BureauCer}
            alt="Bureau Certification"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md hover:scale-105 transition duration-300"
          />
          <img
            src={PakStand}
            alt="Pakistan Standards"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md hover:scale-105 transition duration-300"
          />
          <img
            src={Swisso}
            alt="Swisso Certification"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md hover:scale-105 transition duration-300"
          />
        </div>
      </div>

      {/* Bottom Section (Unchanged) */}
      <div className="border-t border-gray-800 pt-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center text-gray-400 text-sm px-5">
          <span>© 2025 Puma. All rights reserved.</span>
          <span>Terms · Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;