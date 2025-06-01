import React, { useState, useEffect } from "react";

// Props interface
export interface EditableSelectProps {
  label: string;
  value: string;
  name: string;
  options: { value: string; label: string }[];
  isEditing: boolean;
  onEdit: (name: string, value: string) => void;
  required?: boolean;
}

// Component for select inputs
const EditableSelect: React.FC<EditableSelectProps> = ({
  label,
  value,
  name,
  options,
  isEditing,
  onEdit,
  required = true,
}) => {
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  // Update fieldValue when value prop changes
  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  const handleSave = () => {
    onEdit(name, fieldValue);
    setIsFieldEditing(false);
  };

  const handleCancel = () => {
    setFieldValue(value);
    setIsFieldEditing(false);
  };

  // Find the label for the current value
  const getDisplayValue = () => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : "Not specified";
  };

  // View mode - show with edit icon
  if (!isEditing || !isFieldEditing) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-medium">{label}</h2>
        <div className="flex items-center justify-between">
          <p className="opacity-80">{getDisplayValue()}</p>
          {isEditing && (
            <button
              onClick={() => setIsFieldEditing(true)}
              className="text-primary hover:text-primary-focus"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Edit mode - show select field with save/cancel buttons
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium">{label}</h2>
      <select
        value={fieldValue}
        onChange={(e) => setFieldValue(e.target.value)}
        className="select select-bordered w-full bg-base-200"
        required={required}
      >
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="flex mt-2 space-x-2">
        <button onClick={handleSave} className="btn btn-sm btn-accent">
          Save
        </button>
        <button onClick={handleCancel} className="btn btn-sm btn-neutral">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditableSelect;
