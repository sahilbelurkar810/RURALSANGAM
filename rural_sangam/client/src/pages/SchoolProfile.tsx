import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

// Define props interface for EditableField
interface EditableFieldProps {
  label: string;
  value: string;
  name: string;
  isEditing: boolean;
  onEdit: (name: string, value: string) => void;
  multiline?: boolean;
  required?: boolean;
  disabled?: boolean;
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
}) => {
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

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
    return (
      <div className="mb-6">
        <h2 className="text-lg font-medium">{label}</h2>
        <div className="flex items-center justify-between">
          <p className="opacity-80">{value || "Not specified"}</p>
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
          className="textarea textarea-bordered w-full"
          disabled={disabled}
          required={required}
        />
      ) : (
        <input
          type="text"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          className="input input-bordered w-full"
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

const SchoolProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user?.name || "",
    email: user?.user?.email || "",
    phoneNumber: user?.profile?.phoneNumber || "",
    description: user?.profile?.description || "",
    address: user?.profile?.address || "",
  });

  // Handle edit for individual fields
  const handleFieldEdit = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = user?.profile
        ? `${import.meta.env.VITE_API_URL}/school/${user.profile._id}`
        : `${import.meta.env.VITE_API_URL}/school`;

      const method = user?.profile ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        withCredentials: true,
      });

      // Update the user context with the new profile
      if (user) {
        setUser({
          ...user,
          profile: response.data,
        });
      }

      setIsEditing(false);

      if (!user?.profile) {
        // If this was a new profile creation, navigate to home
        navigate("/home");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // If no user or user is not a school, show unauthorized message
  if (!user || !user.user || user.user.role !== "school") {
    return <div>Unauthorized access</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h1 className="card-title text-2xl">School Profile</h1>
            {user.profile && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`btn ${isEditing ? "btn-neutral" : "btn-accent"}`}
              >
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            )}
          </div>

          {error && <div className="alert alert-error mb-4">{error}</div>}

          <div className="divider"></div>

          <div className="space-y-2">
            <EditableField
              label="Name"
              value={formData.name}
              name="name"
              isEditing={isEditing || !user.profile}
              onEdit={handleFieldEdit}
            />

            <EditableField
              label="Email"
              value={formData.email}
              name="email"
              isEditing={isEditing || !user.profile}
              onEdit={handleFieldEdit}
              disabled={true}
            />

            <EditableField
              label="Phone Number"
              value={formData.phoneNumber}
              name="phoneNumber"
              isEditing={isEditing || !user.profile}
              onEdit={handleFieldEdit}
            />

            <EditableField
              label="Description"
              value={formData.description}
              name="description"
              isEditing={isEditing || !user.profile}
              onEdit={handleFieldEdit}
              multiline={true}
            />

            <EditableField
              label="Address"
              value={formData.address}
              name="address"
              isEditing={isEditing || !user.profile}
              onEdit={handleFieldEdit}
              multiline={true}
            />
          </div>

          {/* Show save button when creating new profile or in edit mode */}
          {(isEditing || !user.profile) && (
            <div className="mt-6">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolProfile;
