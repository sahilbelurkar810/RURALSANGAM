import React from "react";
import { useAuth } from "../hooks/useAuth";
import useProfileForm from "../hooks/useProfileForm";
import useProfileSubmit from "../hooks/useProfileSubmit";
import ProfileLayout from "../components/profile/ProfileLayout";
import VolunteerInformation from "../components/profile/VolunteerInformation";

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

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "dob",
      "phoneNumber",
      "address",
      "education",
      "skills",
      "availability",
    ];
    const missingFields = requiredFields.filter((field) => {
      if (field === "skills") {
        return !formData.skills || formData.skills.length === 0;
      }
      return !formData[field as keyof typeof formData];
    });

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    // Log form data for debugging
    console.log("Submitting volunteer profile:", formData);

    // Create a copy of the form data for submission
    let submissionData = {
      ...formData,
      // Ensure DOB is properly formatted as an ISO string for MongoDB Date type
      // If it's already an ISO string, it won't be modified
      dob: formData.dob,
      // Make sure requestedSchool and acceptedSchool are included, even if null
      requestedSchool: formData.requestedSchool || null,
      acceptedSchool: formData.acceptedSchool || null,
      // Ensure skills is an array
      skills: Array.isArray(formData.skills) ? formData.skills : [],
    };

    console.log("Submission data prepared:", submissionData);
    submitProfile(submissionData, "volunteer", () => toggleEditing());
  };

  // If no user or user is not a volunteer, show unauthorized
  if (!user || !user.user || user.user.role !== "volunteer") {
    return <div>Unauthorized access</div>;
  }

  const saveButton = (isEditing || !user.profile) && (
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

  return (
    <ProfileLayout
      title="Volunteer Profile"
      isEditing={isEditing}
      onToggleEdit={user.profile ? toggleEditing : undefined}
      error={error}
      showEditButton={!!user.profile}
      actionButton={saveButton}
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
