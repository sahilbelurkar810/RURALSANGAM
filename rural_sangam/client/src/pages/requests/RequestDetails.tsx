import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Card, Button, Badge, LoadingSpinner } from "../../components/common";
import { applyToRequest, getRequestById, RequestData } from "../../services";

const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [request, setRequest] = useState<RequestData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSchool = user?.user?.role === "school";
  const isVolunteer = user?.user?.role === "volunteer";

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id || !user?.user?.role) return;

      try {
        setLoading(true);
        const requestData = await getRequestById(id, user.user.role);
        setRequest(requestData);
      } catch (err) {
        setError("Failed to load request details");
        console.error("Error fetching request details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, user?.user?.role]);

  const handleApply = async () => {
    if (!id) return;

    try {
      setApplying(true);
      await applyToRequest(id);
      // Show success message
      navigate("/volunteer/requests");
    } catch (error) {
      console.error("Failed to apply:", error);
      // Show error message
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-red-600">
          <p>{error || "Request not found"}</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const volunteerCount = request.volunteers?.length || 0;
  const isFilled = volunteerCount >= request.requiredVolunteers;
  const hasApplied = request.volunteers?.some(
    (v: any) => v.volunteer === user?.user?._id
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          ← Back
        </Button>

        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Request Details
          </h1>

          {isFilled ? (
            <Badge variant="success">Filled</Badge>
          ) : volunteerCount > 0 ? (
            <Badge variant="warning">Partially Filled</Badge>
          ) : (
            <Badge variant="info">Open</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {request.requirementDescription}
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Requirements</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">
                  Volunteers needed:
                </span>
                <span className="ml-2">{request.requiredVolunteers}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <span className="ml-2">{request.duration}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Timings:</span>
                <span className="ml-2">{request.timings}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {request.requiredSkills?.map((skill: string, index: number) => (
                <Badge key={index} variant="default">
                  {skill}
                </Badge>
              )) || (
                <span className="text-gray-500">
                  No specific skills required
                </span>
              )}
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Application Status</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">
                {volunteerCount} of {request.requiredVolunteers} positions
                filled
              </p>
              {hasApplied && (
                <p className="text-green-600 font-medium mt-1">
                  ✓ You have already applied to this request
                </p>
              )}
            </div>

            {isVolunteer && !hasApplied && !isFilled && (
              <Button
                onClick={handleApply}
                loading={applying}
                disabled={applying}
                variant="primary"
              >
                Apply Now
              </Button>
            )}

            {isSchool && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/school/requests/${id}/applications`)
                  }
                >
                  View Applications
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate("/school/requests")}
                >
                  Back to Requests
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RequestDetails;
