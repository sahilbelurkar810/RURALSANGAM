import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, Button, Badge, LoadingSpinner } from "../../components/common";
import { getOpenRequests, applyToRequest, RequestData } from "../../services";
import { useAuth } from "../../hooks/useAuth";

const VolunteerRequestsView: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getOpenRequests();
        setRequests(data || []);
      } catch (err) {
        setError("Failed to load available opportunities");
        console.error("Error fetching volunteer requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApply = async (requestId: string) => {
    try {
      setApplyingTo(requestId);
      await applyToRequest(requestId);

      // Update the local state to reflect the application
      setRequests((prev) =>
        prev.map((request) =>
          request._id === requestId
            ? {
                ...request,
                volunteers: [
                  ...(request.volunteers || []),
                  {
                    volunteer: user?.profile?._id || "",
                    status: "pending" as const,
                    appliedAt: new Date().toISOString(),
                  },
                ],
              }
            : request
        )
      );
    } catch (error) {
      console.error("Failed to apply:", error);
      // Show error message
    } finally {
      setApplyingTo(null);
    }
  };

  const getStatusBadge = (request: RequestData) => {
    // Count only accepted volunteers, not all applications
    const acceptedVolunteers =
      request.volunteers?.filter((v) => v.status === "accepted").length || 0;
    const requiredCount = request.requiredVolunteers;

    if (acceptedVolunteers >= requiredCount) {
      return <Badge variant="success">Filled</Badge>;
    } else if (acceptedVolunteers > 0) {
      return <Badge variant="warning">Partially Filled</Badge>;
    } else {
      return <Badge variant="info">Open</Badge>;
    }
  };

  const hasApplied = (request: RequestData) => {
    return request.volunteers?.some((v) => v.volunteer === user?.profile?._id);
  };

  const getApplicationStatus = (request: RequestData) => {
    const application = request.volunteers?.find(
      (v) => v.volunteer === user?.profile?._id
    );
    return application?.status;
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
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Available Volunteer Opportunities
        </h1>
        <p className="text-gray-600">
          Browse and apply to volunteer opportunities from schools
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No opportunities available
            </h3>
            <p className="text-gray-600">
              Check back later for new volunteer opportunities from schools.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => {
            const applied = hasApplied(request);
            const applicationStatus = getApplicationStatus(request);
            const acceptedVolunteers =
              request.volunteers?.filter((v) => v.status === "accepted")
                .length || 0;
            const isFilled = acceptedVolunteers >= request.requiredVolunteers;

            return (
              <Card key={request._id}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.requirementDescription.substring(0, 100)}
                        {request.requirementDescription.length > 100 && "..."}
                      </h3>
                      {getStatusBadge(request)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Volunteers needed:</span>{" "}
                        {request.requiredVolunteers}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>{" "}
                        {request.duration}
                      </div>
                      <div>
                        <span className="font-medium">Timings:</span>{" "}
                        {request.timings}
                      </div>
                    </div>

                    {request.requiredSkills &&
                      request.requiredSkills.length > 0 && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-700 mr-2">
                            Required Skills:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {request.requiredSkills.map((skill, index) => (
                              <Badge key={index} variant="default" size="sm">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {applied && (
                      <div className="mb-4">
                        <Badge
                          variant={
                            applicationStatus === "accepted"
                              ? "success"
                              : applicationStatus === "rejected"
                              ? "danger"
                              : "warning"
                          }
                        >
                          Application {applicationStatus}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {request.volunteers && request.volunteers.length > 0 && (
                      <span>
                        {request.volunteers.length} volunteer(s) applied
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/volunteer/requests/${request._id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>

                    {!applied && !isFilled && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApply(request._id!)}
                        loading={applyingTo === request._id}
                        disabled={applyingTo === request._id}
                      >
                        Apply Now
                      </Button>
                    )}

                    {applied && (
                      <Button variant="outline" size="sm" disabled>
                        Applied
                      </Button>
                    )}

                    {isFilled && !applied && (
                      <Button variant="outline" size="sm" disabled>
                        Position Filled
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VolunteerRequestsView;
