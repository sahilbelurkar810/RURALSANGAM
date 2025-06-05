import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Card, Button, Badge, LoadingSpinner } from "../../components/common";
import { getMyRequests, RequestData } from "../../services";

const SchoolDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const requestsData = await getMyRequests();
        setRequests(requestsData || []);

        // Calculate statistics
        const totalRequests = requestsData?.length || 0;
        const activeRequests =
          requestsData?.filter((r) => {
            const acceptedVolunteers =
              r.volunteers?.filter((v) => v.status === "accepted").length || 0;
            return acceptedVolunteers < r.requiredVolunteers;
          }).length || 0;
        const totalApplications =
          requestsData?.reduce(
            (sum, r) => sum + (r.volunteers?.length || 0),
            0
          ) || 0;
        const pendingApplications =
          requestsData?.reduce(
            (sum, r) =>
              sum +
              (r.volunteers?.filter((v) => v.status === "pending").length || 0),
            0
          ) || 0;

        setStats({
          totalRequests,
          activeRequests,
          totalApplications,
          pendingApplications,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          School Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.user?.name}! Manage your volunteer requests and
          applications.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalRequests}
            </div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.activeRequests}
            </div>
            <div className="text-sm text-gray-600">Active Requests</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.totalApplications}
            </div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.pendingApplications}
            </div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
            {stats.pendingApplications > 0 && (
              <Badge variant="warning" size="sm" className="mt-1">
                Needs Attention
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Request</h3>
            <p className="text-gray-600 mb-4">
              Post a new volunteer opportunity
            </p>
            <Link to="/school/requests/create">
              <Button variant="primary" size="sm">
                Create New Request
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
            <h3 className="text-lg font-semibold mb-2">My Requests</h3>
            <p className="text-gray-600 mb-4">View and manage your requests</p>
            <Link to="/school/requests">
              <Button variant="outline" size="sm">
                View Requests
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Applications</h3>
            <p className="text-gray-600 mb-4">Review volunteer applications</p>
            <Link to="/school/requests">
              <Button variant="outline" size="sm">
                Review Applications
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No requests yet</p>
                <Link
                  to="/school/requests/create"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Create your first request
                </Link>
              </div>
            ) : (
              <>
                {requests.slice(0, 3).map((request) => (
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
                          {request.volunteers?.length || 0} applications
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
                            : acceptedVolunteers > 0
                            ? "warning"
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
                            : acceptedVolunteers > 0
                            ? "Partial"
                            : "Open";
                        })()}
                      </Badge>
                    </div>
                  </div>
                ))}
                {requests.length > 3 && (
                  <div className="text-center pt-2">
                    <Link
                      to="/school/requests"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View all {requests.length} requests →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Pending Applications</h3>
          <div className="space-y-3">
            {stats.pendingApplications === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No pending applications</p>
              </div>
            ) : (
              <>
                {requests
                  .filter((r) =>
                    r.volunteers?.some((v) => v.status === "pending")
                  )
                  .slice(0, 3)
                  .map((request) => {
                    const pendingCount =
                      request.volunteers?.filter((v) => v.status === "pending")
                        .length || 0;
                    return (
                      <div
                        key={request._id}
                        className="border-l-4 border-l-orange-500 pl-4 py-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {request.requirementDescription.substring(0, 50)}
                              ...
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {pendingCount} pending application
                              {pendingCount > 1 ? "s" : ""}
                            </p>
                          </div>
                          <Link
                            to={`/school/requests/${request._id}/applications`}
                          >
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SchoolDashboard;
