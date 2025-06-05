import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../common';

const AuthDebugInfo: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="bg-red-50 border-red-200">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Authentication Debug</h3>
        <p className="text-red-600">No user data found. Please log in.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Authentication Debug Info</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-blue-700">User Data:</h4>
          <pre className="text-sm bg-white p-2 rounded border overflow-auto">
            {JSON.stringify(user.user, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-blue-700">Profile Data:</h4>
          <pre className="text-sm bg-white p-2 rounded border overflow-auto">
            {JSON.stringify(user.profile, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-blue-700">Authorization Status:</h4>
          <ul className="text-sm space-y-1">
            <li>✅ User authenticated: {user.user ? 'Yes' : 'No'}</li>
            <li>✅ User role: {user.user?.role || 'Unknown'}</li>
            <li>✅ Profile exists: {user.profile ? 'Yes' : 'No'}</li>
            {user.profile && (
              <li>✅ Profile ID: {user.profile._id || 'Not found'}</li>
            )}
            <li>✅ Can create requests: {user.user?.role === 'school' && user.profile ? 'Yes' : 'No'}</li>
            <li>✅ Can view applications: {user.user?.role === 'school' && user.profile ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default AuthDebugInfo;
