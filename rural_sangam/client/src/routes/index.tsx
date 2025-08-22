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

// Dashboard imports (to be created)
import SchoolDashboard from "../pages/dashboards/SchoolDashboard";
import VolunteerDashboard from "../pages/dashboards/VolunteerDashboard";

// Request management imports (to be created)
import CreateRequest from "../pages/requests/CreateRequest";
import ViewRequests from "../pages/requests/ViewRequests";
import RequestDetails from "../pages/requests/RequestDetails";
import ManageApplications from "../pages/requests/ManageApplications";

// Notification imports (to be created)
import Notifications from "../pages/notifications/Notifications";

// Room imports
import { RoomsList, RoomView } from "../components/rooms";

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

          {/* School Routes */}
          <Route
            path="/school/dashboard"
            element={
              <RoleRoute allowedRole="school">
                <SchoolDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/school/profile"
            element={
              <RoleRoute allowedRole="school">
                <SchoolProfile />
              </RoleRoute>
            }
          />
          <Route
            path="/school/requests/create"
            element={
              <RoleRoute allowedRole="school">
                <CreateRequest />
              </RoleRoute>
            }
          />
          <Route
            path="/school/requests"
            element={
              <RoleRoute allowedRole="school">
                <ViewRequests />
              </RoleRoute>
            }
          />
          <Route
            path="/school/requests/:id"
            element={
              <RoleRoute allowedRole="school">
                <RequestDetails />
              </RoleRoute>
            }
          />
          <Route
            path="/school/requests/:id/applications"
            element={
              <RoleRoute allowedRole="school">
                <ManageApplications />
              </RoleRoute>
            }
          />

          {/* Volunteer Routes */}
          <Route
            path="/volunteer/dashboard"
            element={
              <RoleRoute allowedRole="volunteer">
                <VolunteerDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/volunteer/profile"
            element={
              <RoleRoute allowedRole="volunteer">
                <VolunteerProfile />
              </RoleRoute>
            }
          />
          <Route
            path="/volunteer/requests"
            element={
              <RoleRoute allowedRole="volunteer">
                <ViewRequests />
              </RoleRoute>
            }
          />
          <Route
            path="/volunteer/requests/:id"
            element={
              <RoleRoute allowedRole="volunteer">
                <RequestDetails />
              </RoleRoute>
            }
          />

          {/* Shared Routes */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/rooms" element={<RoomsList />} />
          <Route path="/rooms/:roomId" element={<RoomView />} />
        </Route>
      </Route>
    </Routes>
  );
}
