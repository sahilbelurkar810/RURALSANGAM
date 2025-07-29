import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";

export default function ProtectedNavbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  // Base links available to all users
  const baseLinks = [
    { path: "/home", label: "Home" },
    {
      path: "/notifications",
      label: "Notifications",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  // Role-specific links
  const roleSpecificLinks =
    user && user.user
      ? user.user.role === "school"
        ? [
            { path: "/school/dashboard", label: "Dashboard" },
            { path: "/school/requests", label: "My Requests" },
            { path: "/school/requests/create", label: "Create Request" },
          ]
        : user.user.role === "volunteer"
        ? [
            { path: "/volunteer/dashboard", label: "Dashboard" },
            { path: "/volunteer/requests", label: "Browse Requests" },
          ]
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
                    `hover:text-gray-300 relative ${
                      isActive ? "font-bold text-yellow-300" : ""
                    }`
                  }
                >
                  {link.label}
                  {link.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {link.badge > 99 ? "99+" : link.badge}
                    </span>
                  )}
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
