import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Base links available to all users
  const baseLinks = [{ path: "/home", label: "Home" }];
  if (user) {
    console.log(user);
  }

  // Role-specific links
  const roleSpecificLinks = user
    ? user.role === "school"
      ? [{ path: "/school-dashboard", label: "School Dashboard" }]
      : user.role === "volunteer"
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

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-xl">RuralSangam (App)</span>
        <ul className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `hover:text-gray-300 ${
                    isActive ? "font-bold text-yellow-300" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center space-x-4">
        {user && <span className="text-sm">Welcome, {user.name}!</span>}
        <button
          onClick={handleLogout}
          disabled={!user}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 text-sm rounded disabled:opacity-50"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
