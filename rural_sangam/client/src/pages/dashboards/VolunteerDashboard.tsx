import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Card, Button, Badge, LoadingSpinner } from "../../components/common";
import { getOpenRequests, RequestData } from "../../services";

const VolunteerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    myApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const requestsData = await getOpenRequests();
        setRequests(requestsData || []);

        // Calculate statistics - only count truly available opportunities
        const totalOpportunities =
          requestsData?.filter((r) => {
            const acceptedVolunteers =
              r.volunteers?.filter((v) => v.status === "accepted").length || 0;
            return acceptedVolunteers < r.requiredVolunteers;
          }).length || 0;
        const myApplications =
          requestsData?.filter((r) =>
            r.volunteers?.some((v) => v.volunteer === user?.profile?._id)
          ).length || 0;
        const acceptedApplications =
          requestsData?.filter((r) =>
            r.volunteers?.some(
              (v) =>
                v.volunteer === user?.profile?._id && v.status === "accepted"
            )
          ).length || 0;
        const pendingApplications =
          requestsData?.filter((r) =>
            r.volunteers?.some(
              (v) =>
                v.volunteer === user?.profile?._id && v.status === "pending"
            )
          ).length || 0;

        setStats({
          totalOpportunities,
          myApplications,
          acceptedApplications,
          pendingApplications,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.user?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Volunteer Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.user?.name}! Find and apply to volunteer
          opportunities.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalOpportunities}
            </div>
            <div className="text-sm text-gray-600">Available Opportunities</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.myApplications}
            </div>
            <div className="text-sm text-gray-600">My Applications</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.acceptedApplications}
            </div>
            <div className="text-sm text-gray-600">Accepted</div>
            {stats.acceptedApplications > 0 && (
              <Badge variant="success" size="sm" className="mt-1">
                Active
              </Badge>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.pendingApplications}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
            {stats.pendingApplications > 0 && (
              <Badge variant="warning" size="sm" className="mt-1">
                Waiting
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Browse Requests</h3>
            <p className="text-gray-600 mb-4">Find volunteer opportunities</p>
            <Link to="/volunteer/requests">
              <Button variant="primary" size="sm">
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">My Applications</h3>
            <p className="text-gray-600 mb-4">Track your applications</p>
            <Link to="/volunteer/requests">
              <Button variant="outline" size="sm">
                View Applications
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
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
            </div>
            <h3 className="text-lg font-semibold mb-2">Profile</h3>
            <p className="text-gray-600 mb-4">Update your information</p>
            <Link to="/volunteer/profile">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Latest Opportunities</h3>
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No opportunities available</p>
                <Link
                  to="/volunteer/requests"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Check back later
                </Link>
              </div>
            ) : (
              <>
                {requests
                  .filter(
                    (r) =>
                      !r.volunteers?.some(
                        (v) => v.volunteer === user?.profile?._id
                      )
                  )
                  .slice(0, 3)
                  .map((request) => (
                    <div
                      key={request._id}
                      className="border-l-4 border-l-blue-500 pl-4 py-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {request.requirementDescription.substring(0, 60)}...
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {request.requiredVolunteers} volunteers needed
                          </p>
                        </div>
                        <Badge
                          variant={(() => {
                            const acceptedVolunteers =
                              request.volunteers?.filter(
                                (v) => v.status === "accepted"
                              ).length || 0;
                            return acceptedVolunteers >=
                              request.requiredVolunteers
                              ? "success"
                              : "info";
                          })()}
                          size="sm"
                        >
                          {(() => {
                            const acceptedVolunteers =
                              request.volunteers?.filter(
                                (v) => v.status === "accepted"
                              ).length || 0;
                            return acceptedVolunteers >=
                              request.requiredVolunteers
                              ? "Filled"
                              : "Open";
                          })()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                {requests.filter(
                  (r) =>
                    !r.volunteers?.some(
                      (v) => v.volunteer === user?.profile?._id
                    )
                ).length > 3 && (
                  <div className="text-center pt-2">
                    <Link
                      to="/volunteer/requests"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View all opportunities →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">My Applications</h3>
          <div className="space-y-3">
            {stats.myApplications === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No applications yet</p>
                <Link
                  to="/volunteer/requests"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Apply to opportunities
                </Link>
              </div>
            ) : (
              <>
                {requests
                  .filter((r) =>
                    r.volunteers?.some(
                      (v) => v.volunteer === user?.profile?._id
                    )
                  )
                  .slice(0, 3)
                  .map((request) => {
                    const myApplication = request.volunteers?.find(
                      (v) => v.volunteer === user?.profile?._id
                    );
                    return (
                      <div
                        key={request._id}
                        className="border-l-4 border-l-purple-500 pl-4 py-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {request.requirementDescription.substring(0, 50)}
                              ...
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Applied{" "}
                              {myApplication?.appliedAt
                                ? new Date(
                                    myApplication.appliedAt
                                  ).toLocaleDateString()
                                : "recently"}
                            </p>
                          </div>
                          <Badge
                            variant={
                              myApplication?.status === "accepted"
                                ? "success"
                                : myApplication?.status === "rejected"
                                ? "danger"
                                : "warning"
                            }
                            size="sm"
                          >
                            {myApplication?.status || "pending"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                {stats.myApplications > 3 && (
                  <div className="text-center pt-2">
                    <Link
                      to="/volunteer/requests"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View all applications →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
