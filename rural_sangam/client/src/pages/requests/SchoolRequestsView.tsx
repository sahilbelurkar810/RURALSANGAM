import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { getMyRequests, RequestData } from '../../services';

const SchoolRequestsView: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getMyRequests();
        setRequests(data || []);
      } catch (err) {
        setError('Failed to load your requests');
        console.error('Error fetching school requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusBadge = (request: RequestData) => {
    const volunteerCount = request.volunteers?.length || 0;
    const requiredCount = request.requiredVolunteers;
    
    if (volunteerCount >= requiredCount) {
      return <Badge variant="success">Filled</Badge>;
    } else if (volunteerCount > 0) {
      return <Badge variant="warning">Partially Filled</Badge>;
    } else {
      return <Badge variant="info">Open</Badge>;
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Volunteer Requests
          </h1>
          <p className="text-gray-600">
            Manage your volunteer requests and review applications
          </p>
        </div>
        
        <Link to="/school/requests/create">
          <Button variant="primary">
            Create New Request
          </Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No requests yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first volunteer request to get started.
            </p>
            <Link to="/school/requests/create">
              <Button variant="primary">
                Create Your First Request
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <Card key={request._id}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.requirementDescription.substring(0, 100)}
                      {request.requirementDescription.length > 100 && '...'}
                    </h3>
                    {getStatusBadge(request)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Volunteers needed:</span> {request.requiredVolunteers}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {request.duration}
                    </div>
                    <div>
                      <span className="font-medium">Timings:</span> {request.timings}
                    </div>
                  </div>

                  {request.requiredSkills && request.requiredSkills.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700 mr-2">Required Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.requiredSkills.map((skill, index) => (
                          <Badge key={index} variant="default" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  {request.volunteers && request.volunteers.length > 0 ? (
                    <span className="text-blue-600 font-medium">
                      {request.volunteers.length} application(s) received
                    </span>
                  ) : (
                    <span>No applications yet</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Link to={`/school/requests/${request._id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  
                  {request.volunteers && request.volunteers.length > 0 && (
                    <Link to={`/school/requests/${request._id}/applications`}>
                      <Button variant="primary" size="sm">
                        Review Applications ({request.volunteers.length})
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolRequestsView;
