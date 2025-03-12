import React from "react";
import { Link } from "react-router-dom";
import { navItems } from "../../static/data";
import styles from "../../styles/styles";

const Navbar = ({ active }) => {
  return (
    <div className={block 800px:${styles.noramlFlex}}>
      {navItems &&
        navItems.map((item, index) => (
          <div className="flex relative group" key={index}>
            <Link
              to={item.url}
              className={`
                ${
                  active === index + 1
                    ? "text-[#2a9df4] 800px:text-[#2a9df4]"
                    : "text-[#333] 800px:text-[#fff]"
                } 
                pb-[20px] 800px:pb-0 font-[500] px-6 cursor-pointer 
                transition-colors duration-300 ease-in-out 
                uppercase tracking-wide text-[13px]
                hover:text-[#2a9df4]
                relative
              `}
            >
              {item.title}
              {/* Subtle underline effect */}
              <span
                className={`
                  absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#2a9df4]
                  transform transition-transform duration-300 ease-in-out
                  ${active === index + 1 ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                  origin-center
                `}
              />
            </Link>
          </div>
        ))}
      {/* Professional Animation Styles */}
      <style>{`
        .group:hover .hover\\:text-[#2a9df4] {
          color: #2a9df4;
        }
        /* Smooth fade-in for navigation items */
        @keyframes navFade {
          0% {
            opacity: 0;
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Subtle active state indicator */
        @keyframes activeGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(42, 157, 244, 0.2);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(42, 157, 244, 0.1);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(42, 157, 244, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;