import axios from "axios";

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
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
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
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("An unexpected error occurred during login.");
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
    if (axios.isAxiosError(error) && error.response?.status !== 401) {
      console.error(
        "Error checking auth status:",
        error.response?.data?.message || error.message
      );
    }
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
    console.error("Logout API call failed:", error);
    throw error;
  }
};
