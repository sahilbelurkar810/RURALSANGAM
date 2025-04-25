import React from "react";

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
  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {showEditButton && onToggleEdit && (
          <button
            onClick={onToggleEdit}
            className={`btn ${isEditing ? "btn-neutral" : "btn-accent"}`}
          >
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="space-y-2">{children}</div>

      {actionButton && <div className="mt-6">{actionButton}</div>}
    </div>
  );
};

export default ProfileLayout;
