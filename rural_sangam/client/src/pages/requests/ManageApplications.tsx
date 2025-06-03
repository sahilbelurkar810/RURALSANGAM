import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { getVolunteersForRequest, updateVolunteerStatus } from '../../services';

interface VolunteerApplication {
  volunteer: {
    _id: string;
    name: string;
    email: string;
    skills?: string[];
  };
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

const ManageApplications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getVolunteersForRequest(id);
        setApplications(data || []);
      } catch (err) {
        setError('Failed to load applications');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  const handleStatusUpdate = async (volunteerId: string, status: 'accepted' | 'rejected') => {
    if (!id) return;
    
    try {
      setUpdatingStatus(volunteerId);
      await updateVolunteerStatus(id, volunteerId, status);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.volunteer._id === volunteerId 
            ? { ...app, status }
            : app
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      // Show error message
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'rejected':
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
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Back to Request
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manage Applications
        </h1>
        <p className="text-gray-600">
          Review and manage volunteer applications for this request.
        </p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600">
              Applications will appear here when volunteers apply to your request.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <Card key={application.volunteer._id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.volunteer.name}
                    </h3>
                    {getStatusBadge(application.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{application.volunteer.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Applied on:</span>
                      <p className="text-gray-600">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {application.volunteer.skills && application.volunteer.skills.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700 mr-2">Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {application.volunteer.skills.map((skill, index) => (
                          <Badge key={index} variant="default" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {application.status === 'pending' && (
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleStatusUpdate(application.volunteer._id, 'rejected')}
                    loading={updatingStatus === application.volunteer._id}
                    disabled={updatingStatus === application.volunteer._id}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusUpdate(application.volunteer._id, 'accepted')}
                    loading={updatingStatus === application.volunteer._id}
                    disabled={updatingStatus === application.volunteer._id}
                  >
                    Accept
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Button
          variant="outline"
          onClick={() => navigate('/school/requests')}
        >
          Back to All Requests
        </Button>
      </div>
    </div>
  );
};

export default ManageApplications;
