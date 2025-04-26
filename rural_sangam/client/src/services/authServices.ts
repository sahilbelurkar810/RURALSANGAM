import axios from "axios";
import { handleApiError, logError } from "../utils/errorHandling";

type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export const register = async (creds: RegisterCredentials) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      creds,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    logError("Registration failed", error);
    throw new Error(handleApiError(error, "Registration failed"));
  }
};

export const login = async (creds: LoginCredentials) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      creds,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    logError("Login failed", error);
    throw new Error(handleApiError(error, "Login failed"));
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/me`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    // A 401 error means the user is not logged in (no valid cookie)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Don't log 401s as they're expected when not logged in
      throw error;
    }

    logError("Auth status check failed", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    logError("Logout failed", error);
    throw error;
  }
};
