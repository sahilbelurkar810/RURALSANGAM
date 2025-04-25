import React from "react";

class Navbar extends React.Component {
  render() {
    return (
      <nav className="bg-neutral  shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="text-3xl font-bold ">RuralSangam</div>
          <button
            className="md:hidden text-white focus:outline-none"
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
          {/* Add public navigation links here if needed later */}
        </div>
      </nav>
    );
  }
}
export default Navbar;
