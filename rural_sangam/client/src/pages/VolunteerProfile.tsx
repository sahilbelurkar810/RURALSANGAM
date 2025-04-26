import React from "react";
import { useAuth } from "../hooks/useAuth";
import useProfileForm from "../hooks/useProfileForm";
import useProfileSubmit from "../hooks/useProfileSubmit";
import ProfileLayout from "../components/profile/ProfileLayout";
import VolunteerInformation from "../components/profile/VolunteerInformation";
import { validateVolunteerProfile } from "../utils/profileValidation";

/**
 * Volunteer Profile page component
 * Handles displaying and editing volunteer profile information
 */
const VolunteerProfile: React.FC = () => {
  const { user } = useAuth();
  const {
    formData,
    isEditing,
    handleFieldEdit,
    handleSkillsEdit,
    toggleEditing,
    setIsEditing,
  } = useProfileForm<"volunteer">("volunteer");

  const { submitProfile, loading, error, setError } = useProfileSubmit();

  // Handle profile submission
  const handleSubmit = () => {
    // Validate the form data
    const validationError = validateVolunteerProfile(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create a normalized copy of the form data for submission
    const submissionData = {
      ...formData,
      dob: formData.dob,
      requestedSchool: formData.requestedSchool || null,
      acceptedSchool: formData.acceptedSchool || null,
      skills: Array.isArray(formData.skills) ? formData.skills : [],
    };

    // Submit the profile
    submitProfile(submissionData, "volunteer", toggleEditing);
  };

  // If no user or user is not a volunteer, show unauthorized
  if (!user || !user.user || user.user.role !== "volunteer") {
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
      title="Volunteer Profile"
      isEditing={isEditing}
      onToggleEdit={user.profile ? toggleEditing : undefined}
      error={error}
      showEditButton={!!user.profile}
      actionButton={renderSaveButton()}
    >
      <VolunteerInformation
        formData={formData}
        isEditing={isEditing}
        hasProfile={!!user.profile}
        handleFieldEdit={handleFieldEdit}
        handleSkillsEdit={handleSkillsEdit}
      />
    </ProfileLayout>
  );
};

export default VolunteerProfile;
