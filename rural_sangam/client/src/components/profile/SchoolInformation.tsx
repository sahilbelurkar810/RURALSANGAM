import React from "react";
import { SchoolFormData } from "../../hooks/useProfileForm";
import EditableField from "../editable/EditableField";

interface SchoolInformationProps {
  formData: SchoolFormData;
  isEditing: boolean;
  hasProfile: boolean;
  handleFieldEdit: (name: string, value: string) => void;
}

const SchoolInformation: React.FC<SchoolInformationProps> = ({
  formData,
  isEditing,
  hasProfile,
  handleFieldEdit,
}) => {
  return (
    <>
      {/* Basic Information Section */}
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 7h6m-6 4h6m-6 4h6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Basic Information
              </h2>
              <p className="text-xs text-gray-600">
                Essential details about your school
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <EditableField
          label="School Name"
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
                Where your school is located and how to reach you
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <EditableField
          label="School Address"
          value={formData.address}
          name="address"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
          multiline={true}
        />
      </div>

      {/* About Section */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                About Your School
              </h2>
              <p className="text-xs text-gray-600">
                Tell volunteers about your school's mission and needs
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <EditableField
          label="School Description"
          value={formData.description}
          name="description"
          isEditing={isEditing || !hasProfile}
          onEdit={handleFieldEdit}
          multiline={true}
        />
      </div>
    </>
  );
};

export default SchoolInformation;
