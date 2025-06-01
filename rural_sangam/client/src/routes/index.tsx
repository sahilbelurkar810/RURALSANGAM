import { Routes, Route, Navigate } from "react-router";
import React, { ReactNode } from "react";
import Home from "../pages/Home";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Intro from "../pages/Intro";
import IntroLayout from "../layouts/IntroLayout";
import HomeLayout from "../layouts/HomeLayout";
import ProtectedRoute from "./helpers/ProtectedRoute";
import PublicRoute from "./helpers/PublicRoute";
import SchoolProfile from "../pages/SchoolProfile";
import VolunteerProfile from "../pages/VolunteerProfile";
import { useAuth } from "../hooks/useAuth";

// Define props interface for RoleRoute
interface RoleRouteProps {
  children: ReactNode;
  allowedRole: "school" | "volunteer";
}

// Role-based route guard component
const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (!user || !user.user || user.user.role !== allowedRole) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<IntroLayout />}>
          <Route path="/" element={<Intro />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<HomeLayout />}>
          <Route path="/home" element={<Home />} />

          {/* School profile route */}
          <Route
            path="/school/profile"
            element={
              <RoleRoute allowedRole="school">
                <SchoolProfile />
              </RoleRoute>
            }
          />

          {/* Volunteer profile route */}
          <Route
            path="/volunteer/profile"
            element={
              <RoleRoute allowedRole="volunteer">
                <VolunteerProfile />
              </RoleRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
