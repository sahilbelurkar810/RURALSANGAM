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
      <div className="mb-4">
        <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200 group">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {label}
            </h3>
            {isEditing && !disabled && (
              <button
                onClick={() => setIsFieldEditing(true)}
                className="opacity-0 group-hover:opacity-100 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all duration-200"
                title={`Edit ${label}`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="text-gray-900 font-medium">
            {displayValue || (
              <span className="text-gray-400 italic">Not specified</span>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Edit mode - show input field with save/cancel buttons
  return (
    <div className="mb-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
          <h3 className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
            Editing {label}
          </h3>
        </div>

        {multiline ? (
          <textarea
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-sm"
            disabled={disabled}
            required={required}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            type={type}
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            disabled={disabled}
            required={required}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-1.5 text-sm font-medium"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-1.5 text-sm font-medium"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableField;
