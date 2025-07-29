import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, Button, Badge, LoadingSpinner } from "../../components/common";
import { getVolunteersForRequest, updateVolunteerStatus } from "../../services";
import { useAuth } from "../../hooks/useAuth";

interface VolunteerApplication {
  volunteer: {
    _id: string;
    fullName?: string; // This is what the server actually returns
    name?: string; // Fallback field
    email?: string;
    skills?: string[];
    phoneNumber?: string;
    education?: string;
    availability?: string;
  };
  status: "pending" | "accepted" | "rejected";
  appliedAt?: string;
}

const ManageApplications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper function to safely get volunteer name
  const getVolunteerName = (volunteer: VolunteerApplication["volunteer"]) => {
    return volunteer?.fullName || volunteer?.name || "Unknown Volunteer";
  };

  // Helper function to get volunteer initial
  const getVolunteerInitial = (
    volunteer: VolunteerApplication["volunteer"]
  ) => {
    const name = getVolunteerName(volunteer);
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const fetchApplications = async () => {
      if (!id) return;

      // Check if user is authenticated and has school profile
      if (!user || !user.user || user.user.role !== "school") {
        setError("You must be logged in as a school to view applications.");
        setLoading(false);
        return;
      }

      if (!user.profile) {
        setError(
          "School profile not found. Please complete your profile first."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getVolunteersForRequest(id);
        console.log("Raw volunteer applications data:", data);

        // Log each application to see the structure
        if (data && data.length > 0) {
          data.forEach((app: any, index: number) => {
            console.log(`Application ${index}:`, app);
            console.log(`Volunteer data:`, app.volunteer);
          });
        }

        setApplications(data || []);
      } catch (err: any) {
        console.error("Error fetching applications:", err);

        if (err.message?.includes("Not authorized")) {
          setError(
            "You are not authorized to view applications for this request."
          );
        } else if (err.message?.includes("Request not found")) {
          setError("Request not found. It may have been deleted.");
        } else {
          setError("Failed to load applications. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id, user]);

  const handleStatusUpdate = async (
    volunteerId: string,
    status: "accepted" | "rejected"
  ) => {
    if (!id) return;

    try {
      setUpdatingStatus(volunteerId);
      setSuccessMessage(null);

      await updateVolunteerStatus(id, volunteerId, status);

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.volunteer._id === volunteerId ? { ...app, status } : app
        )
      );

      // Show success message
      const application = applications.find(
        (app) => app.volunteer._id === volunteerId
      );
      const volunteerName = application
        ? getVolunteerName(application.volunteer)
        : "Volunteer";
      setSuccessMessage(`${volunteerName} has been ${status} successfully.`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Failed to update status:", error);
      setError(`Failed to ${status} application. Please try again.`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge variant="success">Accepted</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          ← Back to Request
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Volunteer Applications
        </h1>
        <p className="text-gray-600">
          Review and manage volunteer applications for this request.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              When volunteers apply to your request, their applications will
              appear here for you to review and manage.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <Card
              key={application.volunteer._id}
              className="hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header with name and status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {getVolunteerInitial(application.volunteer)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {getVolunteerName(application.volunteer)}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Applied{" "}
                        {application.appliedAt
                          ? new Date(application.appliedAt).toLocaleDateString()
                          : "recently"}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {/* Email - Always show with fallback */}
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">
                        {application.volunteer.email || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Phone - Only show if available */}
                  {application.volunteer.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">
                          {application.volunteer.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Education - Only show if available */}
                  {application.volunteer.education && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Education</p>
                        <p className="text-gray-900">
                          {application.volunteer.education}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Volunteer ID - Show as fallback info */}
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Volunteer ID</p>
                      <p className="text-gray-900 font-mono text-sm">
                        {application.volunteer._id.slice(-8)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {application.volunteer.skills &&
                  application.volunteer.skills.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Skills & Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {application.volunteer.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="default"
                            size="sm"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Availability */}
                {application.volunteer.availability && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </h4>
                    <p className="text-gray-600">
                      {application.volunteer.availability}
                    </p>
                  </div>
                )}

                {/* Limited Info Notice */}
                {(!application.volunteer.email ||
                  !application.volunteer.phoneNumber) && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-amber-600 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-amber-800 font-medium">
                          Limited Information Available
                        </p>
                        <p className="text-sm text-amber-700">
                          Some volunteer details may not be displayed. Contact
                          the volunteer directly for complete information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {application.status === "pending" && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Review this application and make a decision
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(
                          application.volunteer._id,
                          "rejected"
                        )
                      }
                      loading={updatingStatus === application.volunteer._id}
                      disabled={updatingStatus === application.volunteer._id}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(
                          application.volunteer._id,
                          "accepted"
                        )
                      }
                      loading={updatingStatus === application.volunteer._id}
                      disabled={updatingStatus === application.volunteer._id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              )}

              {/* Status Message for Processed Applications */}
              {application.status !== "pending" && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Application has been{" "}
                    <span
                      className={`font-medium ${
                        application.status === "accepted"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {application.status}
                    </span>
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Summary and Navigation */}
      <div className="mt-12 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {applications.length > 0 && (
            <span>
              {applications.length} application
              {applications.length !== 1 ? "s" : ""} total •{" "}
              {applications.filter((app) => app.status === "pending").length}{" "}
              pending •{" "}
              {applications.filter((app) => app.status === "accepted").length}{" "}
              accepted •{" "}
              {applications.filter((app) => app.status === "rejected").length}{" "}
              declined
            </span>
          )}
        </div>
        <Button variant="outline" onClick={() => navigate("/school/requests")}>
          Back to All Requests
        </Button>
      </div>
    </div>
  );
};

export default ManageApplications;
