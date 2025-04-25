import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

const PublicRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect authenticated users to the home page
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // Render public routes (login, signup, etc.)
  return <Outlet />;
};

export default PublicRoute;
