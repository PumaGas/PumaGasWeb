// Footer.js
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
} from "../../static/data";

const Footer = () => {
  return (
    <div className="bg-[#000] text-white">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 sm:text-center">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <img
            src={ImgUrl}
            alt="Puma Electric & Gas Appliances Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-4 cursor-pointer"
          />
          <p className="text-gray-300 text-sm sm:text-base">
            The home and elements needed to create beautiful products.
          </p>
          <div className="flex items-center mt-4">
            <AiFillFacebook size={25} className="cursor-pointer hover:text-teal-400" />
            <AiOutlineTwitter
              size={25}
              className="ml-4 cursor-pointer hover:text-teal-400"
            />
            <AiFillInstagram
              size={25}
              className="ml-4 cursor-pointer hover:text-teal-400"
            />
            <AiFillYoutube
              size={25}
              className="ml-4 cursor-pointer hover:text-teal-400"
            />
          </div>
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold text-lg">Company</h1>
          {footerProductLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold text-lg">Shop</h1>
          {footercompanyLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold text-lg">Support</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center pt-2 text-gray-400 text-sm pb-8">
        <span>© 2025 Puma. All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
      </div>
    </div>
  );
};

export default Footer;