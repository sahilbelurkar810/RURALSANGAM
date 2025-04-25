import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

// Interface for the volunteer profile form data
export interface VolunteerFormData {
  name: string;
  email: string;
  dob: string;
  phoneNumber: string;
  address: string;
  education: string;
  skills: string[];
  availability: string;
  contribution: string;
  requestedSchool?: string | null;
  acceptedSchool?: string | null;
}

// Interface for the school profile form data
export interface SchoolFormData {
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
  address: string;
}

type ProfileFormData<T extends "volunteer" | "school"> = T extends "volunteer"
  ? VolunteerFormData
  : SchoolFormData;

// Type guard to check if a form data is VolunteerFormData
function isVolunteerFormData(data: any): data is VolunteerFormData {
  return "skills" in data;
}

// Hook to handle profile form data
export function useProfileForm<T extends "volunteer" | "school">(
  profileType: T
) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData<T>>(
    {} as ProfileFormData<T>
  );

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      if (profileType === "volunteer") {
        setFormData({
          name: user?.user?.name || "",
          email: user?.user?.email || "",
          dob: user?.profile?.dob
            ? new Date(user.profile.dob).toISOString().split("T")[0]
            : "",
          phoneNumber: user?.profile?.phoneNumber || "",
          address: user?.profile?.address || "",
          education: user?.profile?.education || "",
          skills: user?.profile?.skills || [],
          availability: user?.profile?.availability || "",
          contribution: user?.profile?.contribution || "",
          requestedSchool: user?.profile?.requestedSchool || null,
          acceptedSchool: user?.profile?.acceptedSchool || null,
        } as ProfileFormData<T>);
      } else {
        setFormData({
          name: user?.user?.name || "",
          email: user?.user?.email || "",
          phoneNumber: user?.profile?.phoneNumber || "",
          description: user?.profile?.description || "",
          address: user?.profile?.address || "",
        } as ProfileFormData<T>);
      }
    }
  }, [user, profileType]);

  // Handle field updates
  const handleFieldEdit = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle skills update (array of strings)
  const handleSkillsEdit = (name: string, skills: string[]) => {
    setFormData((prev) => {
      // If the form data is for a volunteer profile and has skills property
      if (isVolunteerFormData(prev)) {
        return {
          ...prev,
          skills,
        } as ProfileFormData<T>;
      }
      return prev;
    });
  };

  // Toggle editing state
  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  return {
    formData,
    isEditing,
    handleFieldEdit,
    handleSkillsEdit,
    toggleEditing,
    setIsEditing,
  };
}

export default useProfileForm;
