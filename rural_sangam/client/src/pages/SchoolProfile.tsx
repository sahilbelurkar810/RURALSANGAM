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
        className="btn btn-accent w-full"
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : user.profile ? (
          "Save Changes"
        ) : (
          "Create Profile"
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
