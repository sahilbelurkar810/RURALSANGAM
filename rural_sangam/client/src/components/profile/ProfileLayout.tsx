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
    <div className="min-h-screen p-4 md:p-8 bg-base-100">
      <div className="max-w-full mx-auto bg-base-200 rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl flex">
        {/* Header section with title and buttons */}
        <div className="bg-accent p-4 md:p-6 lg:p-8 w-1/4">
          <div className="flex flex-col justify-between h-full">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-content">{title}</h1>
            <div className="flex flex-col gap-3">
              {showEditButton && onToggleEdit && (
                <button
                  onClick={onToggleEdit}
                  className={`btn btn-md md:btn-lg ${
                    isEditing ? "btn-secondary" : "btn-neutral"
                  } transition-all duration-300 hover:scale-105 w-full`}
                >
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-md md:btn-lg btn-outline btn-error transition-all duration-300 hover:scale-105 w-full"
                disabled={isEditing}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* Error display */}
          {error && (
            <div className="px-4 md:px-6 lg:px-8 mt-4">
              <div className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Content section */}
          <div className="p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8">
              {children}
            </div>

            {/* Action button section */}
            {actionButton && (
              <div className="mt-8 pt-4 border-t border-base-300">
                <div className="flex justify-end">
                  {actionButton}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
