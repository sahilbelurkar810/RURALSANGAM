import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

interface ProfileLayoutProps {
  title: string;
  isEditing: boolean;
  onToggleEdit?: () => void;
  error?: string | null;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  showEditButton?: boolean;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  title,
  isEditing,
  onToggleEdit,
  error,
  children,
  actionButton,
  showEditButton = true,
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDashboard = () => {
    if (user?.user?.role === "school") {
      navigate("/school/dashboard");
    } else if (user?.user?.role === "volunteer") {
      navigate("/volunteer/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto p-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <h1 className="text-2xl font-bold text-white">{title}</h1>
                  <p className="text-blue-100 text-sm">
                    {user?.user?.role === "school"
                      ? "Manage your school information"
                      : "Manage your volunteer profile"}
                  </p>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDashboard}
                  className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-1.5 text-sm"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </button>

                {showEditButton && onToggleEdit && (
                  <button
                    onClick={onToggleEdit}
                    className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-sm font-medium ${
                      isEditing
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-white text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <svg
                          className="w-3.5 h-3.5"
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
                        Cancel
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  disabled={isEditing}
                  className="px-3 py-1.5 bg-red-500/10 backdrop-blur-sm text-red-100 border border-red-400/20 rounded-lg hover:bg-red-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Compact Status Indicator */}
          <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    user?.profile ? "bg-green-500" : "bg-amber-500"
                  }`}
                ></div>
                <span className="text-xs font-medium text-gray-600">
                  {user?.profile ? "Profile Complete" : "Setup Required"}
                </span>
              </div>
              {isEditing && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Editing Mode
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-red-600"
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
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {children}
          </div>

          {/* Action Button Section */}
          {actionButton && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              {actionButton}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
