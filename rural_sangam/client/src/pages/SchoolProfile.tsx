import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useProfileForm } from "../hooks/useProfileForm";
import { useProfileSubmit } from "../hooks/useProfileSubmit";
import ProfileLayout from "../components/profile/ProfileLayout";
import SchoolInformation from "../components/profile/SchoolInformation";
import { validateSchoolProfile } from "../utils/profileValidation";

/**
 * School Profile page component
 * Handles displaying and editing school profile information
 */
const SchoolProfile: React.FC = () => {
  const { user } = useAuth();
  const { formData, isEditing, handleFieldEdit, toggleEditing, setIsEditing } =
    useProfileForm<"school">("school");

  const { submitProfile, loading, error, setError } = useProfileSubmit();

  // Handle profile submission
  const handleSubmit = () => {
    // Validate the form data
    const validationError = validateSchoolProfile(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Submit the profile
    submitProfile(formData, "school", toggleEditing);
  };

  // If no user or user is not a school, show unauthorized
  if (!user || !user.user || user.user.role !== "school") {
    return <div>Unauthorized access</div>;
  }

  // Save button render component
  const renderSaveButton = () => {
    if (!isEditing && user.profile) return null;

    return (
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg"
      >
        {loading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Saving...
          </>
        ) : user.profile ? (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Changes
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
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
            Create Profile
          </>
        )}
      </button>
    );
  };

  return (
    <ProfileLayout
      title="School Profile"
      isEditing={isEditing}
      onToggleEdit={user.profile ? toggleEditing : undefined}
      error={error}
      showEditButton={!!user.profile}
      actionButton={renderSaveButton()}
    >
      <SchoolInformation
        formData={formData}
        isEditing={isEditing}
        hasProfile={!!user.profile}
        handleFieldEdit={handleFieldEdit}
      />
    </ProfileLayout>
  );
};

export default SchoolProfile;
