import { VolunteerFormData, SchoolFormData } from "../hooks/useProfileForm";

/**
 * Validates volunteer profile form data
 * @param formData - The volunteer form data to validate
 * @returns Error message string if validation fails, null if valid
 */
export const validateVolunteerProfile = (
  formData: VolunteerFormData
): string | null => {
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
    return `Please fill in the following required fields: ${missingFields.join(
      ", "
    )}`;
  }

  return null;
};

/**
 * Validates school profile form data
 * @param formData - The school form data to validate
 * @returns Error message string if validation fails, null if valid
 */
export const validateSchoolProfile = (
  formData: SchoolFormData
): string | null => {
  const requiredFields = [
    "name",
    "email",
    "phoneNumber",
    "description",
    "address",
  ];

  const missingFields = requiredFields.filter(
    (field) => !formData[field as keyof typeof formData]
  );

  if (missingFields.length > 0) {
    return `Please fill in the following required fields: ${missingFields.join(
      ", "
    )}`;
  }

  return null;
};
