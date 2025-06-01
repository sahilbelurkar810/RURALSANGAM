import React, { useState } from "react";

// Props interface
export interface EditableFieldProps {
  label: string;
  value: string;
  name: string;
  isEditing: boolean;
  onEdit: (name: string, value: string) => void;
  multiline?: boolean;
  required?: boolean;
  disabled?: boolean;
  type?: "text" | "date" | "email" | "tel";
}

// Component for inline editing of text fields
const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  name,
  isEditing,
  onEdit,
  multiline = false,
  required = true,
  disabled = false,
  type = "text",
}) => {
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  // Update fieldValue when value prop changes
  React.useEffect(() => {
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

  // View mode - show with edit icon
  if (!isEditing || !isFieldEditing) {
    // Format date for display if it's a date field
    const displayValue =
      type === "date" && value ? new Date(value).toLocaleDateString() : value;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-medium">{label}</h2>
        <div className="flex items-center justify-between">
          <p className="opacity-80">{displayValue || "Not specified"}</p>
          {isEditing && !disabled && (
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

  // Edit mode - show input field with save/cancel buttons
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium">{label}</h2>
      {multiline ? (
        <textarea
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          rows={3}
          className="textarea textarea-bordered w-full bg-base-200"
          disabled={disabled}
          required={required}
        />
      ) : (
        <input
          type={type}
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          className="input input-bordered w-full bg-base-200"
          disabled={disabled}
          required={required}
        />
      )}
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

export default EditableField;
