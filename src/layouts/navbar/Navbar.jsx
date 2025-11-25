import React from "react";
import { useNavigate } from "react-router-dom";
// import logo from "./assets/logo1.png";
import logo from "./assets/finalLogo.png";

const Navbar = ({
  active,
  setActive,
  isMenuOpen,
  setIsMenuOpen,
  navbarItems,
  toggleMenu,
}) => {
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    setActive(item);


    if (item === "Professional Feed") {
      navigate("/posts");
      return;
    }

    if (item === "Login") {
      navigate("/login");
      return;
    }

    const route = item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`;

    navigate(route); 
  };

  return (
    <div className="flex justify-center mt-5 sticky top-2 z-50">
      <nav className="w-[700px] h-[70px] rounded-full flex items-center justify-between px-8 relative shadow-lg bg-white">

        {/* Logo */}
        <img src={logo} alt="logo" className="w-44 h-auto" loading="lazy" />

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-8 font-semibold">
          {navbarItems.map((item) => (
            <li
              key={item}
              onClick={() => handleNavClick(item)}
              className="cursor-pointer relative group px-2 py-1 text-gray-800"
            >
              {item}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-500 
                ${active === item ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button className="sm:hidden p-2" onClick={toggleMenu}>
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5M3.75 16.5h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
          )}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#EFEFEF] rounded-lg shadow-lg mt-2 sm:hidden z-10">
            <ul className="flex flex-col gap-4 p-4 font-semibold">
              {navbarItems.map((item) => (
                <li
                  key={item}
                  onClick={() => {
                    handleNavClick(item);
                    setIsMenuOpen(false);
                  }}
                  className="cursor-pointer relative group px-2 py-1 text-gray-800"
                >
                  {item}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-500 
                    ${active === item ? "w-full" : "w-0 group-hover:w-full"}`}
                  ></span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
