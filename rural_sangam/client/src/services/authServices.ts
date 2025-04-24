import axios from "axios";

type register = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type login = {
  email: string;
  password: string;
};

const register = async (creds: register) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      creds
    );
    console.log("Registration successful:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

const login = async (creds: login) => {
  console.log("Logging in user...", creds);
};

export { register, login };
