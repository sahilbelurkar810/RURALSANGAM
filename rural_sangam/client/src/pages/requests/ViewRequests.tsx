import React from "react";
import { useAuth } from "../../hooks/useAuth";
import SchoolRequestsView from "./SchoolRequestsView";
import VolunteerRequestsView from "./VolunteerRequestsView";

const ViewRequests: React.FC = () => {
  const { user } = useAuth();

  if (user?.user?.role === "school") {
    return <SchoolRequestsView />;
  } else if (user?.user?.role === "volunteer") {
    return <VolunteerRequestsView />;
  }

  return <div>Access denied</div>;
};

export default ViewRequests;
