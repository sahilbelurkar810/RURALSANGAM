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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-0 bg-base-200 rounded-lg shadow-md">
      {/* Header section with title and buttons */}
      <div className="bg-accent p-6 rounded-t-lg ">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-content">{title}</h1>
          <div className="flex space-x-3">
            {showEditButton && onToggleEdit && (
              <button
                onClick={onToggleEdit}
                className={`btn ${isEditing ? "btn-secondary" : "btn-neutral"}`}
              >
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-error"
              disabled={isEditing}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-6 mt-4">
          <div className="alert alert-error">{error}</div>
        </div>
      )}

      {/* Content section */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {children}
        </div>

        {/* Action button section */}
        {actionButton && (
          <div className="mt-8 pt-4 border-t">{actionButton}</div>
        )}
      </div>
    </div>
  );
};

export default ProfileLayout;
