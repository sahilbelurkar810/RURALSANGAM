import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, Button, Badge, LoadingSpinner } from "../../components/common";
import { getVolunteersForRequest, updateVolunteerStatus } from "../../services";
import { useAuth } from "../../hooks/useAuth";

interface VolunteerApplication {
  volunteer: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    education: string;
    skills: string[];
    availability: string;
    dob?: string;
    contribution?: string;
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
    return volunteer?.name || "Unknown Volunteer";
  };

  // Helper function to get volunteer initial
  const getVolunteerInitial = (
    volunteer: VolunteerApplication["volunteer"]
  ) => {
    const name = getVolunteerName(volunteer);
    return name.charAt(0).toUpperCase();
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-blue-50 border-blue-200 text-blue-700 transition-all duration-200"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Request
          </Button>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  Volunteer Applications
                </h1>
                <p className="text-gray-600 text-lg">
                  Review and manage volunteer applications for this request
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            {applications.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {applications.length}
                  </div>
                  <div className="text-sm text-blue-700">
                    Total Applications
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {
                      applications.filter((app) => app.status === "pending")
                        .length
                    }
                  </div>
                  <div className="text-sm text-amber-700">Pending Review</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      applications.filter((app) => app.status === "accepted")
                        .length
                    }
                  </div>
                  <div className="text-sm text-green-700">Accepted</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {
                      applications.filter((app) => app.status === "rejected")
                        .length
                    }
                  </div>
                  <div className="text-sm text-red-700">Declined</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-green-600"
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
              </div>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="text-center py-20 px-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-blue-500"
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
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Applications Yet
              </h3>
              <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed mb-6">
                When volunteers discover and apply to your request, their
                applications will appear here for you to review and manage.
              </p>
              <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto">
                <h4 className="font-semibold text-blue-900 mb-2">
                  What happens next?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Volunteers will see your request in the platform</li>
                  <li>• They can apply with their skills and availability</li>
                  <li>• You'll review and accept/decline applications here</li>
                  <li>• Accepted volunteers will be notified automatically</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {applications.map((application) => (
              <Card
                key={application.volunteer._id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                {/* Header Section with Gradient Background */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                        <span className="text-white font-bold text-xl">
                          {getVolunteerInitial(application.volunteer)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {getVolunteerName(application.volunteer)}
                        </h3>
                        <div className="flex items-center gap-2 text-blue-100">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z"
                            />
                          </svg>
                          <span className="text-sm">
                            Applied{" "}
                            {application.appliedAt
                              ? new Date(
                                  application.appliedAt
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "recently"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(application.status)}
                      {application.volunteer.dob && (
                        <span className="text-blue-100 text-sm">
                          Age: {calculateAge(application.volunteer.dob)} years
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Contact Details Card */}
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-600"
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
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Email Address
                            </p>
                            <p className="text-gray-900 font-medium">
                              {application.volunteer.email}
                            </p>
                          </div>
                        </div>

                        {application.volunteer.phoneNumber && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-green-600"
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
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Phone Number
                              </p>
                              <p className="text-gray-900 font-medium">
                                {application.volunteer.phoneNumber}
                              </p>
                            </div>
                          </div>
                        )}

                        {application.volunteer.address && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="text-gray-900 font-medium">
                                {application.volunteer.address}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Professional Details Card */}
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                          />
                        </svg>
                        Professional Background
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-indigo-600"
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
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Education</p>
                            <p className="text-gray-900 font-medium">
                              {application.volunteer.education}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Availability
                            </p>
                            <p className="text-gray-900 font-medium">
                              {application.volunteer.availability}
                            </p>
                          </div>
                        </div>

                        {application.volunteer.contribution && (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-teal-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Motivation
                              </p>
                              <p className="text-gray-900 font-medium">
                                {application.volunteer.contribution}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  {application.volunteer.skills &&
                    application.volunteer.skills.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          Skills & Expertise
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {application.volunteer.skills.map((skill, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg px-4 py-2 text-center"
                            >
                              <span className="text-emerald-800 font-medium text-sm">
                                {skill}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Action Buttons */}
                {application.status === "pending" && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-amber-600"
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
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Review Required
                          </p>
                          <p className="text-sm text-gray-600">
                            Please review this application and make a decision
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() =>
                            handleStatusUpdate(
                              application.volunteer._id,
                              "rejected"
                            )
                          }
                          loading={updatingStatus === application.volunteer._id}
                          disabled={
                            updatingStatus === application.volunteer._id
                          }
                          className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-200 px-6 py-2 font-medium"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() =>
                            handleStatusUpdate(
                              application.volunteer._id,
                              "accepted"
                            )
                          }
                          loading={updatingStatus === application.volunteer._id}
                          disabled={
                            updatingStatus === application.volunteer._id
                          }
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 px-6 py-2 font-medium shadow-lg"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
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
                          Accept Application
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Message for Processed Applications */}
                {application.status !== "pending" && (
                  <div
                    className={`px-6 py-4 border-t border-gray-200 ${
                      application.status === "accepted"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50"
                        : "bg-gradient-to-r from-red-50 to-pink-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          application.status === "accepted"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {application.status === "accepted" ? (
                          <svg
                            className="w-5 h-5 text-green-600"
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
                        ) : (
                          <svg
                            className="w-5 h-5 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Application{" "}
                          {application.status === "accepted"
                            ? "Accepted"
                            : "Declined"}
                        </p>
                        <p className="text-sm text-gray-600">
                          This application has been {application.status} and the
                          volunteer has been notified.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-gray-600">
              {applications.length > 0 ? (
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    {applications.length} Total Application
                    {applications.length !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    {
                      applications.filter((app) => app.status === "pending")
                        .length
                    }{" "}
                    Pending
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    {
                      applications.filter((app) => app.status === "accepted")
                        .length
                    }{" "}
                    Accepted
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    {
                      applications.filter((app) => app.status === "rejected")
                        .length
                    }{" "}
                    Declined
                  </span>
                </div>
              ) : (
                <span className="text-sm">
                  Ready to receive volunteer applications
                </span>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/school/requests")}
              className="hover:bg-blue-50 border-blue-200 text-blue-700 transition-all duration-200 px-6 py-2"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0l-4-4m4 4l-4 4"
                />
              </svg>
              View All Requests
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageApplications;
