import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Wishlist from "../Wishlist/Wishlist";
import { ImgUrl } from "../../static/data";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { allProducts } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedDesktopCategory, setExpandedDesktopCategory] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    window.addEventListener("scroll", () => {
      if (window.scrollY > 70) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
    return () => {
      setIsMounted(false);
      setDropDown(false);
    };
  }, []);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleSearchChange = useCallback(
    debounce((term) => {
      if (!allProducts) return;
      const recommendedProducts = allProducts.filter((product) => product.recommended);
      const filteredProducts = term
        ? allProducts.filter((product) =>
            product.name.toLowerCase().includes(term.toLowerCase())
          )
        : [];
      setSearchData({
        filtered: filteredProducts,
        recommended: recommendedProducts,
      });
    }, 300),
    [allProducts]
  );

  const onSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearchChange(term);
  };

  const onSearchFocus = () => {
    handleSearchChange(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchData(null);
  };

  const closeDropdown = () => {
    setSearchData(null); // Closes the dropdown
  };

  const toggleCategory = (categoryId, isDesktop = false) => {
    if (isDesktop) {
      setExpandedDesktopCategory(expandedDesktopCategory === categoryId ? null : categoryId);
    } else {
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    }
  };

  const handleNavigation = () => {
    setDropDown(false);
    setExpandedDesktopCategory(null);
  };

  const renderSearchItem = (item, index) => (
    <Link key={index} to={/product/${item._id}} className="block">
      <div className="w-full flex items-center py-2 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer animate-slide-in">
        <img
          src={${item.images && item.images[0]?.url ? item.images[0].url : "default-image.jpg"}}
          alt={item.name}
          className="w-[40px] h-[40px] mr-[10px] object-cover rounded-md shadow-sm"
        />
        <div className="flex items-center w-full">
          <h1 className="text-sm font-medium text-gray-800">{item.name}</h1>
        </div>
      </div>
    </Link>
  );

  return (
    <>
      {/* Desktop Header */}
      <div className={${styles.section}}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src={ImgUrl}
                alt="Logo"
                className="w-[60px] h-[60px] object-contain rounded-full hover:scale-110 transition-transform duration-300"
              />
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-[50%] relative group" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Products..."
                  value={searchTerm}
                  onChange={onSearchChange}
                  onFocus={onSearchFocus}
                  className="h-[45px] w-full pl-12 pr-12 py-2 border-2 border-[#3957db] rounded-full text-sm shadow-lg bg-gradient-to-r from-white to-gray-50 focus:ring-4 focus:ring-blue-200 focus:border-[#3957db] transition-all duration-300 hover:shadow-xl animate-pulse-once"
                />
                <AiOutlineSearch
                  size={24}
                  className="absolute left-3 top-2.5 text-[#3957db] group-hover:scale-125 transition-transform duration-300 animate-bounce"
                />
                {searchTerm && (
                  <AiOutlineClose
                    size={20}
                    className="absolute right-3 top-3 text-gray-500 hover:text-red-500 cursor-pointer transition-colors duration-300 animate-spin-once"
                    onClick={clearSearch}
                  />
                )}
              </div>
              {searchData && (
                <div className="absolute min-h-[20vh] max-h-[50vh] overflow-y-auto bg-white shadow-2xl z-[10] p-4 w-full mt-2 rounded-lg border border-gray-200 animate-drop-down">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-800">Search Results</span>
                    <AiOutlineClose
                      size={20}
                      className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors duration-300"
                      onClick={closeDropdown}
                    />
                  </div>
                  {searchTerm && searchData.filtered.length > 0 && (
                    <div className="mb-4">
                      {searchData.filtered.map((item, index) => renderSearchItem(item, index))}
                    </div>
                  )}
                  {searchData.recommended.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Recommended</h3>
                      {searchData.recommended.map((item, index) => renderSearchItem(item, index))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-[rgb(53,50,117)] h-[70px]`}
      >
        <div className={${styles.section} relative ${styles.noramlFlex} justify-between}>
          <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
            <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
            <button
              className="h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md"
              onClick={() => setDropDown(!dropDown)}
            >
              All Categories
              <IoIosArrowDown size={20} className="mr-2" />
            </button>
            {isMounted && dropDown && (
              <div className="absolute mt-1 w-full bg-white shadow-lg rounded-md z-10 max-h-[50vh] overflow-y-auto animate-drop-down">
                {Array.isArray(categoriesData) ? (
                  categoriesData.map((category) => (
                    <div key={category.id} className="border-b border-gray-200">
                      <button
                        className="w-full flex items-center justify-between py-2 px-4 text-[16px] text-[#000000b7] hover:bg-gray-100"
                        onClick={() => toggleCategory(category.id, true)}
                      >
                        <div className="flex items-center">
                          <img
                            src={category.image_Url || "https://via.placeholder.com/24"}
                            alt={category.title}
                            className="w-6 h-6 mr-2 object-cover rounded"
                          />
                          {category.title || "Unnamed Category"}
                        </div>
                        <IoIosArrowForward
                          size={16}
                          className={`transition-transform ${
                            expandedDesktopCategory === category.id ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                      {expandedDesktopCategory === category.id && Array.isArray(category.subcategories) && (
                        <div className="pl-6 bg-gray-50">
                          {category.subcategories.length > 0 ? (
                            category.subcategories.map((sub, index) => (
                              <Link
                                key={index}
                                to={/products?category=${category.title}&subcategory=${sub.title}}
                                className="block py-1.5 px-4 text-[14px] text-[#00000091] hover:bg-gray-200"
                                onClick={handleNavigation}
                              >
                                {sub.title}
                              </Link>
                            ))
                          ) : (
                            <p className="py-1.5 px-4 text-[14px] text-[#00000091]">
                              No subcategories available
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="py-2 px-4 text-[16px] text-[#000000b7]">
                    Invalid categories data: {JSON.stringify(categoriesData)}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className={${styles.noramlFlex}}>
            <Navbar active={activeHeading} />
          </div>
          <div className="flex">
            <div className={${styles.noramlFlex}}>
              <div
                className="relative cursor-pointer mr-[15px] p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors duration-200"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 flex items-center justify-center text-white font-mono text-[12px]">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>
            <div className={${styles.noramlFlex}}>
              <Link to="/shop-login" className="text-[18px] text-[#fff] hover:text-gray-300 transition-colors duration-200">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header - Fixed Header with Line */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : "relative"
        } w-full h-[70px] bg-[#fff] z-50 shadow-md 800px:hidden animate-slide-down`}
      >
        <div className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-white to-gray-100 relative">
          <div>
            <BiMenuAltLeft
              size={40}
              className="text-[#3957db] hover:text-blue-600 transition-colors duration-200 animate-bounce-in cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </div>
          <div className="w-[60%] relative group" ref={searchRef}>
            <div className="relative z-20">
              <input
                type="text"
                placeholder="Search Products..."
                value={searchTerm}
                onChange={onSearchChange}
                onFocus={onSearchFocus}
                className="h-[48px] w-full pl-12 pr-12 py-2 border-2 border-transparent bg-white rounded-[30px] text-sm shadow-md focus:ring-4 focus:ring-blue-200 focus:border-[#3957db] transition-all duration-300 hover:shadow-lg animate-pulse-once bg-gradient-to-r from-white to-gray-50 border-t-2 border-b-2 border-l-2 border-r-2 border-[#3957db]/80"
              />
              <AiOutlineSearch
                size={24}
                className="absolute left-3 top-2.5 text-[#3957db] group-hover:scale-125 transition-transform duration-300 animate-bounce"
              />
              {searchTerm && (
                <AiOutlineClose
                  size={20}
                  className="absolute right-3 top-3 text-gray-500 hover:text-red-500 cursor-pointer transition-colors duration-300 animate-spin-once"
                  onClick={clearSearch}
                />
              )}
            </div>
            {/* Non-Sticky Dropdown Over Banner */}
            {searchData && (
              <div className="absolute min-h-[20vh] max-h-[60vh] overflow-y-auto bg-white/95 backdrop-blur-md shadow-xl z-[10] p-4 w-full mt-2 rounded-xl border border-gray-200/50 animate-drop-down">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-900 tracking-wide">Search Results</span>
                  <AiOutlineClose
                    size={18}
                    className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors duration-300 animate-spin-once"
                    onClick={closeDropdown}
                  />
                </div>
                {searchTerm && searchData.filtered.length > 0 && (
                  <div className="mb-4">
                    {searchData.filtered.map((item, index) => renderSearchItem(item, index))}
                  </div>
                )}
                {searchData.recommended.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 tracking-wide border-t pt-2 border-gray-200">Recommended Products</h3>
                    {searchData.recommended.map((item, index) => renderSearchItem(item, index))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <Link to="/">
              <img
                src={ImgUrl}
                alt="Logo"
                className="max-w-[42px] max-h-[42px] object-contain rounded-full shadow-md hover:opacity-80 transition-all duration-200 animate-bounce-in cursor-pointer"
              />
            </Link>
          </div>
        </div>
        {/* Horizontal Line Below Header */}
        <div className="w-full h-[1px] bg-gray-300"></div>
      </div>

      {/* Mobile Sidebar - "Close" in Red with Animation */}
      {open && (
        <div className="fixed w-full bg-[#0000005f] z-40 h-full top-0 left-0 transition-opacity duration-300">
          <div className="fixed w-[75%] bg-white h-screen top-[71px] left-0 z-50 overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-in-out animate-slide-in-left">
            <div className="w-full flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
              <div
                className="relative cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-colors duration-300 animate-bounce"
                onClick={() => {
                  setOpenWishlist(true);
                  setOpen(false);
                }}
              >
                <AiOutlineHeart size={36} className="text-red-500" />
                <span className="absolute -right-1 -top-1 rounded-full bg-[#3bc177] w-5 h-5 flex items-center justify-center text-white font-mono text-[12px]">
                  {wishlist && wishlist.length}
                </span>
              </div>
              <div className="cursor-pointer" onClick={() => setOpen(false)}>
                <span className="text-base font-semibold text-red-500 animate-pop-in">Close</span>
              </div>
            </div>

            <div className="w-[90%] mx-auto mt-4">
              <button
                className="h-[45px] w-full flex justify-between items-center pl-4 bg-white font-sans text-lg font-[500] border-[#3957db] border-[2px] rounded-md hover:bg-blue-50 transition-colors duration-300 animate-pulse"
                onClick={() => setDropDown(!dropDown)}
              >
                All Categories
                <IoIosArrowDown size={22} className="mr-2 text-gray-600" />
              </button>
              {isMounted && dropDown && (
                <div className="mt-2 max-h-[40vh] overflow-y-auto bg-white shadow-lg rounded-md border border-gray-100 animate-drop-down">
                  {Array.isArray(categoriesData) && categoriesData.map((category) => (
                    <div key={category.id} className="border-b border-gray-200 animate-slide-in">
                      <button
                        className="w-full flex items-center justify-between py-3 px-4 text-[16px] text-[#000000b7] hover:bg-gray-100 transition-colors duration-300"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center">
                          <img src={category.image_Url || "https://via.placeholder.com/24"} alt={category.title} className="w-6 h-6 mr-2 object-cover rounded animate-bounce-in" />
                          <span className="text-gray-800">{category.title || "Unnamed Category"}</span>
                        </div>
                        <IoIosArrowForward size={16} className={text-gray-600 transition-transform duration-200 ${expandedCategory === category.id ? "rotate-90" : ""}} />
                      </button>
                      {expandedCategory === category.id && Array.isArray(category.subcategories) && (
                        <div className="pl-6 bg-gray-50 animate-fade-in">
                          {category.subcategories.length > 0 ? (
                            category.subcategories.map((sub, index) => (
                              <Link
                                key={index}
                                to={/products?category=${category.title}&subcategory=${sub.title}}
                                onClick={() => setOpen(false)}
                                className="block py-2 px-4 text-[14px] text-[#00000091] hover:bg-gray-200 transition-colors duration-300 animate-slide-in"
                              >
                                {sub.title}
                              </Link>
                            ))
                          ) : (
                            <p className="py-2 px-4 text-[14px] text-[#00000091]">
                              No subcategories available
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Navbar active={activeHeading} />
            <div className="flex w-full justify-center py-6">
              {isAuthenticated ? (
                <div>
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <img
                      src={${user.avatar?.url}}
                      alt=""
                      className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88] hover:opacity-80 transition-opacity duration-300 animate-bounce-in"
                    />
                  </Link>
                </div>
              ) : (
                <Link
                  to="/shop-login"
                  className="text-[18px] text-[#000000b7] font-semibold hover:text-blue-500 transition-colors duration-300 animate-pulse"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Popup */}
      {openWishlist && (
        <div className="fixed inset-0 bg-[#00000080] z-50 flex items-center justify-center transition-opacity duration-300">
          <Wishlist setOpenWishlist={setOpenWishlist} />
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes pulseOnce {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes spinOnce {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
        .animate-bounce-in { animation: bounceIn 0.5s ease-out forwards; }
        .animate-pulse-once { animation: pulseOnce 0.6s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.3s ease-out forwards; }
        .animate-drop-down { animation: dropDown 0.3s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-bounce { animation: bounce 1s infinite; }
        .animate-pulse { animation: pulse 1.5s infinite; }
        .animate-spin-once { animation: spinOnce 0.4s ease-out forwards; }
        .animate-pop-in { animation: popIn 0.5s ease-out forwards; }
      `}</style>
    </>
  );
};

export default Header;