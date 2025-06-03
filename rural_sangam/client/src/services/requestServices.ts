import axios from "axios";
import { handleApiError, logError } from "../utils/errorHandling";

// Base API URL
const API_BASE = import.meta.env.VITE_API_URL;

// Types
export type RequestData = {
  _id?: string;
  requirementDescription: string;
  requiredSkills: string[];
  requiredVolunteers: number;
  timings: string;
  duration: string;
  school?: string;
  volunteers?: Array<{
    volunteer: string;
    status: "pending" | "accepted" | "rejected";
    appliedAt: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateRequestData = Omit<
  RequestData,
  "_id" | "school" | "volunteers" | "createdAt" | "updatedAt"
>;

export type VolunteerApplication = {
  volunteer: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
};

// Request Services

// School creates request
export const createRequest = async (requestData: CreateRequestData) => {
  try {
    const response = await axios.post(`${API_BASE}/request`, requestData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Create request failed", error);
    throw new Error(handleApiError(error, "Failed to create request"));
  }
};

// School sees own requests
export const getMyRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE}/request/my`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get my requests failed", error);
    throw new Error(handleApiError(error, "Failed to get your requests"));
  }
};

// Volunteer sees open requests
export const getOpenRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE}/request/open`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get open requests failed", error);
    throw new Error(handleApiError(error, "Failed to get open requests"));
  }
};

// Volunteer applies to request
export const applyToRequest = async (requestId: string) => {
  try {
    const response = await axios.post(
      `${API_BASE}/request/apply/${requestId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    logError("Apply to request failed", error);
    throw new Error(handleApiError(error, "Failed to apply to request"));
  }
};

// Volunteer creates request (if allowed)
export const volunteerCreateRequest = async (
  requestData: CreateRequestData
) => {
  try {
    const response = await axios.post(
      `${API_BASE}/request/volunteer/request`,
      requestData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    logError("Volunteer create request failed", error);
    throw new Error(
      handleApiError(error, "Failed to create volunteer request")
    );
  }
};

// School gets volunteers for a specific request
export const getVolunteersForRequest = async (requestId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE}/request/${requestId}/volunteers`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    logError("Get volunteers for request failed", error);
    throw new Error(
      handleApiError(error, "Failed to get volunteers for request")
    );
  }
};

// School updates volunteer status (accept/reject)
export const updateVolunteerStatus = async (
  requestId: string,
  volunteerId: string,
  status: "accepted" | "rejected"
) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/request/${requestId}/volunteer/${volunteerId}`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    logError("Update volunteer status failed", error);
    throw new Error(handleApiError(error, "Failed to update volunteer status"));
  }
};

// Get request details by ID (workaround until backend adds specific endpoint)
export const getRequestById = async (
  requestId: string,
  userRole: "school" | "volunteer"
) => {
  try {
    let requests: RequestData[];

    if (userRole === "school") {
      requests = await getMyRequests();
    } else {
      requests = await getOpenRequests();
    }

    const request = requests.find((r) => r._id === requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    return request;
  } catch (error) {
    logError("Get request by ID failed", error);
    throw new Error(handleApiError(error, "Failed to get request details"));
  }
};
