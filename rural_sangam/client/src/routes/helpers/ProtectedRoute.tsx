import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // After loading completes, redirect to login if not authenticated
  if (!user || !user.user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
