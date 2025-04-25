import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";
import axios, { AxiosError } from "axios";
import { VolunteerFormData, SchoolFormData } from "./useProfileForm";

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

      console.log(`Submitting to ${url}`, formData);
      console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
      console.log("Current user:", user);
      console.log("User role:", user?.user?.role);
      console.log("Profile type:", profileType);

      if (profileType === "volunteer" && isVolunteerFormData(formData)) {
        console.log("Checking volunteer data:");
        console.log("- DOB:", formData.dob, typeof formData.dob);
        console.log(
          "- Skills:",
          formData.skills,
          Array.isArray(formData.skills)
        );

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

      console.log("Server response:", response.data);

      // Update the user context with the new profile
      if (user) {
        // For volunteer, the data might be nested in volunteerData
        const profileData =
          profileType === "volunteer"
            ? response.data.volunteerData || response.data
            : response.data.schoolData || response.data;

        console.log("Setting user profile to:", profileData);

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
      console.error("Profile submission error:", err);

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        console.log("Axios error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });

        if (axiosError.response) {
          // Server responded with an error
          const serverError = axiosError.response.data as any;
          const errorMessage =
            serverError.message ||
            serverError.msg ||
            `Server error (${axiosError.response.status}): ${JSON.stringify(
              serverError
            )}`;

          setError(errorMessage);
          console.error("Server error details:", serverError);
        } else if (axiosError.request) {
          // Request was made but no response
          setError(
            "No response received from server. Please check your connection."
          );
        } else {
          // Something else happened
          setError(axiosError.message || "An unknown error occurred");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }

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
