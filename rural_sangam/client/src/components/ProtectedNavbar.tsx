import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center px-[100px]">
      <div className="flex items-center space-x-4 gap-8">
        <div>
          <span className="font-bold text-3xl text-base-content">
            RuralSangam
          </span>
        </div>
        <div>
          <ul className="hidden md:flex space-x-16 text-lg">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }: { isActive: boolean }) =>
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
      </div>
      <div className="flex items-center space-x-4">
        {user && user.user && (
          <span className="text-sm">Welcome, {user.user.name}!</span>
        )}
        <Link
          to={getProfilePath()}
          className="border border-white hover:bg-gray-700 text-white font-medium py-1 px-4 rounded-md disabled:opacity-50"
        >
          Your Profile
        </Link>
      </div>
    </nav>
  );
}
