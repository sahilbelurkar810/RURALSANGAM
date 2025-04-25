import React from "react";
import { VolunteerFormData } from "../../hooks/useProfileForm";
import EditableField from "../editable/EditableField";
import EditableSkills from "../editable/EditableSkills";
import EditableSelect from "../editable/EditableSelect";

interface VolunteerInformationProps {
  formData: VolunteerFormData;
  isEditing: boolean;
  hasProfile: boolean;
  handleFieldEdit: (name: string, value: string) => void;
  handleSkillsEdit: (name: string, skills: string[]) => void;
}

const VolunteerInformation: React.FC<VolunteerInformationProps> = ({
  formData,
  isEditing,
  hasProfile,
  handleFieldEdit,
  handleSkillsEdit,
}) => {
  // Availability options
  const availabilityOptions = [
    { value: "Weekdays", label: "Weekdays" },
    { value: "Weekends", label: "Weekends" },
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Flexible", label: "Flexible" },
  ];

  return (
    <>
      <EditableField
        label="Name"
        value={formData.name}
        name="name"
        isEditing={isEditing || !hasProfile}
        onEdit={handleFieldEdit}
      />

      <EditableField
        label="Email"
        value={formData.email}
        name="email"
        isEditing={isEditing || !hasProfile}
        onEdit={handleFieldEdit}
        disabled={true}
      />

      <EditableField
        label="Date of Birth"
        value={formData.dob}
        name="dob"
        isEditing={isEditing || !hasProfile}
        onEdit={handleFieldEdit}
        type="date"
      />

      <EditableField
        label="Phone Number"
        value={formData.phoneNumber}
        name="phoneNumber"
        isEditing={isEditing || !hasProfile}
        onEdit={handleFieldEdit}
      />

      <EditableField
        label="Address"
        value={formData.address}
        name="address"
        isEditing={isEditing || !hasProfile}
        onEdit={handleFieldEdit}
        multiline={true}
      />

      <EditableField
        label="Education"
        value={formData.education}
        name="education"
        isEditing={isEditing || !hasProfile}
        onEdit={handleFieldEdit}
      />

      <EditableSkills
        skills={formData.skills}
        isEditing={isEditing || !hasProfile}
        onEdit={handleSkillsEdit}
      />

      <EditableSelect
        label="Availability"
        value={formData.availability}
        name="availability"
        options={availabilityOptions}
        isEditing={isEditing || !hasProfile}
        onEdit={handleFieldEdit}
      />

      <EditableField
        label="Contribution"
        value={formData.contribution}
        name="contribution"
        isEditing={isEditing || !hasProfile}
        onEdit={handleFieldEdit}
        multiline={true}
        required={false}
      />
    </>
  );
};

export default VolunteerInformation;
