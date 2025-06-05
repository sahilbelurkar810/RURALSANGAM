import axios from "axios";
import { handleApiError, logError } from "../utils/errorHandling";

// Base API URL
const API_BASE = import.meta.env.VITE_API_URL;

// Types
export type SchoolProfile = {
  _id?: string;
  userId?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSchoolData = Omit<SchoolProfile, '_id' | 'userId' | 'createdAt' | 'updatedAt'>;

// School Services
export const getAllSchools = async () => {
  try {
    const response = await axios.get(`${API_BASE}/school`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get all schools failed", error);
    throw new Error(handleApiError(error, "Failed to get schools"));
  }
};

export const getSchoolById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE}/school/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get school failed", error);
    throw new Error(handleApiError(error, "Failed to get school"));
  }
};

export const createSchool = async (schoolData: CreateSchoolData) => {
  try {
    const response = await axios.post(`${API_BASE}/school`, schoolData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Create school failed", error);
    throw new Error(handleApiError(error, "Failed to create school profile"));
  }
};

export const updateSchool = async (id: string, schoolData: Partial<CreateSchoolData>) => {
  try {
    const response = await axios.put(`${API_BASE}/school/${id}`, schoolData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Update school failed", error);
    throw new Error(handleApiError(error, "Failed to update school profile"));
  }
};

export const deleteSchool = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE}/school/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Delete school failed", error);
    throw new Error(handleApiError(error, "Failed to delete school profile"));
  }
};
