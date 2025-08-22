import axios from "axios";
import { handleApiError, logError } from "../utils/errorHandling";

// Base API URL
const API_BASE = import.meta.env.VITE_API_URL;

// Types
export type VolunteerProfile = {
  _id?: string;
  userId?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  skills: string[];
  dob: string;
  availability: string;
  acceptedSchool?: string[];
  education: string;
  requestedSchool?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateVolunteerData = Omit<
  VolunteerProfile,
  "_id" | "userId" | "createdAt" | "updatedAt"
>;

// Volunteer Services
export const getAllVolunteers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/volunteer`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get all volunteers failed", error);
    throw new Error(handleApiError(error, "Failed to get volunteers"));
  }
};

export const getVolunteerById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE}/volunteer/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get volunteer failed", error);
    throw new Error(handleApiError(error, "Failed to get volunteer"));
  }
};

export const createVolunteer = async (volunteerData: CreateVolunteerData) => {
  try {
    const response = await axios.post(`${API_BASE}/volunteer`, volunteerData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Create volunteer failed", error);
    throw new Error(
      handleApiError(error, "Failed to create volunteer profile")
    );
  }
};

export const updateVolunteer = async (
  id: string,
  volunteerData: Partial<CreateVolunteerData>
) => {
  try {
    const response = await axios.put(
      `${API_BASE}/volunteer/${id}`,
      volunteerData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    logError("Update volunteer failed", error);
    throw new Error(
      handleApiError(error, "Failed to update volunteer profile")
    );
  }
};

export const deleteVolunteer = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE}/volunteer/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Delete volunteer failed", error);
    throw new Error(
      handleApiError(error, "Failed to delete volunteer profile")
    );
  }
};
