import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Base links available to all users
  const baseLinks = [{ path: "/home", label: "Home" }];

  // Role-specific links (excluding profile)
  const roleSpecificLinks =
    user && user.user
      ? user.user.role === "school"
        ? [{ path: "/school-dashboard", label: "School Dashboard" }]
        : user.user.role === "volunteer"
        ? [{ path: "/volunteer-tasks", label: "My Tasks" }]
        : []
      : [];

  const navLinks = [...baseLinks, ...roleSpecificLinks];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getProfilePath = () => {
    if (!user || !user.user) return "/login";
    return user.user.role === "school"
      ? "/school/profile"
      : "/volunteer/profile";
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-bold text-2xl sm:text-3xl text-base-content">
                RuralSangam
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <ul className="flex space-x-8 text-lg">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }: { isActive: boolean }) =>
                        `hover:text-gray-300 transition-colors duration-200 ${
                          isActive ? "font-bold text-yellow-300" : ""
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="flex items-center space-x-4">
                {user && user.user && (
                  <span className="text-sm">Welcome, {user.user.name}!</span>
                )}
                <Link
                  to={getProfilePath()}
                  className="border border-white hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Your Profile
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4">
              <ul className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }: { isActive: boolean }) =>
                        `block hover:text-gray-300 transition-colors duration-200 ${
                          isActive ? "font-bold text-yellow-300" : ""
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
                {user && user.user && (
                  <li className="text-sm">Welcome, {user.user.name}!</li>
                )}
                <li>
                  <Link
                    to={getProfilePath()}
                    className="block border border-white hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  );
}
