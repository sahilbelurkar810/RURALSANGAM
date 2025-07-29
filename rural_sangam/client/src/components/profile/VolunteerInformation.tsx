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
      {/* Personal Information Section */}
      <div className="col-span-2">
        <h2 className="text-xl font-semibold mb-4 text-accent-content border-b pb-2">
          Personal Information
        </h2>
      </div>

      <div>
        <EditableField
          label="Name"
          value={formData.name}
          name="name"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
        />
      </div>

      <div>
        <EditableField
          label="Email"
          value={formData.email}
          name="email"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
          disabled={true}
        />
      </div>

      <div>
        <EditableField
          label="Date of Birth"
          value={formData.dob}
          name="dob"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
          type="date"
        />
      </div>

      <div>
        <EditableField
          label="Phone Number"
          value={formData.phoneNumber}
          name="phoneNumber"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
        />
      </div>

      <div className="col-span-2">
        <EditableField
          label="Address"
          value={formData.address}
          name="address"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
          multiline={true}
        />
      </div>

      {/* Professional Information Section */}
      <div className="col-span-2 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-accent-content border-b pb-2">
          Other Information
        </h2>
      </div>

      <div>
        <EditableField
          label="Education"
          value={formData.education}
          name="education"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
        />
      </div>

      <div>
        <EditableSelect
          label="Availability"
          value={formData.availability}
          name="availability"
          options={availabilityOptions}
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
        />
      </div>

      <div className="col-span-2">
        <EditableSkills
          skills={formData.skills}
          isEditing={isEditing || !hasProfile}
          onEdit={handleSkillsEdit}
        />
      </div>

      <div className="col-span-2">
        <EditableField
          label="Contribution"
          value={formData.contribution || ""}
          name="contribution"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
          multiline={true}
          required={false}
        />
      </div>
    </>
  );
};

export default VolunteerInformation;
