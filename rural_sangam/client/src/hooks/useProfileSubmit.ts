import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";
import axios from "axios";
import { VolunteerFormData, SchoolFormData } from "./useProfileForm";
import { handleApiError, logError } from "../utils/errorHandling";

// Debug utility that only logs in development mode
const debug = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[Debug] ${message}`, data);
  }
};

// Custom type guard to check if form data is for a volunteer
function isVolunteerFormData(data: any): data is VolunteerFormData {
  return "skills" in data && "dob" in data;
}

// Hook to handle profile submission
export function useProfileSubmit() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit the profile data
  const submitProfile = async (
    formData: VolunteerFormData | SchoolFormData,
    profileType: "volunteer" | "school",
    onSuccess?: () => void
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Determine API endpoint based on profile type
      const endpoint = profileType === "volunteer" ? "volunteer" : "school";

      const url = user?.profile
        ? `${import.meta.env.VITE_API_URL}/${endpoint}/${user.profile._id}`
        : `${import.meta.env.VITE_API_URL}/${endpoint}`;

      const method = user?.profile ? "put" : "post";

      debug(`Submitting to ${url}`, { formData, profileType });

      if (profileType === "volunteer" && isVolunteerFormData(formData)) {
        // Ensure skills is an array
        if (!Array.isArray(formData.skills)) {
          formData.skills = [];
        }
      }

      const response = await axios({
        method,
        url,
        data: formData,
        withCredentials: true,
      });

      debug("Server response received", response.data);

      // Update the user context with the new profile
      if (user) {
        // For volunteer, the data might be nested in volunteerData
        const profileData =
          profileType === "volunteer"
            ? response.data.volunteerData || response.data
            : response.data.schoolData || response.data;

        setUser({
          ...user,
          profile: profileData,
        });
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Navigate to home on new profile creation
      if (!user?.profile) {
        navigate("/home");
      }

      return response.data;
    } catch (err) {
      logError("Profile submission error", err);
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitProfile,
    loading,
    error,
    setError,
  };
}

export default useProfileSubmit;
