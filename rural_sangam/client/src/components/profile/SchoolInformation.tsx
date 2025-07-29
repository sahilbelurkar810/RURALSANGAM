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
      {/* School Information Section */}
      <div className="col-span-2">
        <h2 className="text-xl font-semibold mb-4 text-accent-content border-b pb-2">
          School Information
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

      <div className="col-span-2">
        <EditableField
          label="Description"
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
