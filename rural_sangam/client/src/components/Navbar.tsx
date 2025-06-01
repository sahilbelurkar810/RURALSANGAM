import React, { useState } from "react";
import { Link } from "react-router"; // Use react-router-dom

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md md:px-[80px] sticky top-0 z-50">
      <div className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-bold text-blue-700">RuralSangam</div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Menu Items */}
        <div className="hidden md:flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-6">
          <Link
            to="/login"
            className="block px-4 py-2 text-blue-600 hover:bg-blue-50 transition"
            onClick={toggleMenu}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={toggleMenu}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
