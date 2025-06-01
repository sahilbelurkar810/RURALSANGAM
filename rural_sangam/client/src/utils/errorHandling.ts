import axios, { AxiosError } from "axios";

/**
 * Standardized error handler for API requests
 * @param error - The error thrown by axios or other sources
 * @param defaultMessage - Default message to show if error cannot be parsed
 * @returns A standardized error message
 */
export const handleApiError = (
  error: unknown,
  defaultMessage = "An unknown error occurred"
): string => {
  // Handle Axios errors (API responses)
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    if (axiosError.response) {
      // Server responded with an error
      const serverError = axiosError.response.data;
      return (
        serverError.message ||
        serverError.msg ||
        `Server error (${axiosError.response.status}): ${JSON.stringify(
          serverError
        )}`
      );
    } else if (axiosError.request) {
      // Request was made but no response received
      return "No response received from server. Please check your connection.";
    } else {
      // Error setting up the request
      return axiosError.message || defaultMessage;
    }
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return error.message;
  }

  // Handle unknown errors
  return defaultMessage;
};

/**
 * Log errors only in development mode
 */
export const logError = (message: string, error?: any): void => {
  if (import.meta.env.DEV) {
    console.error(`[Error] ${message}`, error);
  }
};
