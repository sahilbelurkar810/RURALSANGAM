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
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Personal Information
              </h2>
              <p className="text-xs text-gray-600">
                Your basic details and contact information
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <EditableField
          label="Full Name"
          value={formData.name}
          name="name"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
        />
      </div>

      <div>
        <EditableField
          label="Email Address"
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

      {/* Contact & Location Section */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Location & Contact
              </h2>
              <p className="text-xs text-gray-600">
                Where you're located and how schools can reach you
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <EditableField
          label="Home Address"
          value={formData.address}
          name="address"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
          multiline={true}
        />
      </div>

      {/* Professional Information Section */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 mb-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Professional Background
              </h2>
              <p className="text-xs text-gray-600">
                Your education, skills, and availability
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <EditableField
          label="Education Background"
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

      <div className="lg:col-span-2">
        <EditableSkills
          skills={formData.skills}
          isEditing={isEditing || !hasProfile}
          onEdit={handleSkillsEdit}
        />
      </div>
    </>
  );
};

export default VolunteerInformation;
