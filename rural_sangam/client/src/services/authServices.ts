import axios from "axios";
import { handleApiError, logError } from "../utils/errorHandling";

// Base API URL
const API_BASE = import.meta.env.VITE_API_URL;

// Types
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

// Auth Services
export const register = async (creds: RegisterCredentials) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, creds, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Registration failed", error);
    throw new Error(handleApiError(error, "Registration failed"));
  }
};

export const login = async (creds: LoginCredentials) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, creds, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Login failed", error);
    throw new Error(handleApiError(error, "Login failed"));
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE}/auth/me`, {
      withCredentials: true,
    });
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
    await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    logError("Logout failed", error);
    throw error;
  }
};

// Additional auth services
export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE}/auth/getUser/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get user failed", error);
    throw new Error(handleApiError(error, "Failed to get user"));
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/auth/getAllUsers`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get all users failed", error);
    throw new Error(handleApiError(error, "Failed to get users"));
  }
};
