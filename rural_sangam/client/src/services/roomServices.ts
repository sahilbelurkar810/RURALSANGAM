import axios from "axios";
import { handleApiError, logError } from "../utils/errorHandling";

// Base API URL
const API_BASE = import.meta.env.VITE_API_URL;

// Types
export type Message = {
  sender: string;
  senderName: string;
  senderRole: "school" | "volunteer";
  message: string;
  timestamp: string;
  _id?: string;
};

export type Room = {
  _id: string;
  roomId: string;
  requestId: {
    _id: string;
    requirementDescription: string;
  };
  school: {
    _id: string;
    name: string;
  };
  volunteer: {
    _id: string;
    name: string;
  };
  schoolUserId: {
    _id: string;
    name: string;
  };
  volunteerUserId: {
    _id: string;
    name: string;
  };
  jitsiRoomName: string;
  messages: Message[];
  isActive: boolean;
  createdAt: string;
};

// Room Services
export const getUserRooms = async (): Promise<Room[]> => {
  try {
    const response = await axios.get(`${API_BASE}/rooms/my-rooms`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get user rooms failed", error);
    throw new Error(handleApiError(error, "Failed to get rooms"));
  }
};

export const getRoomDetails = async (roomId: string): Promise<Room> => {
  try {
    const response = await axios.get(`${API_BASE}/rooms/${roomId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get room details failed", error);
    throw new Error(handleApiError(error, "Failed to get room details"));
  }
};

export const sendMessage = async (roomId: string, message: string) => {
  try {
    const response = await axios.post(
      `${API_BASE}/rooms/${roomId}/message`,
      { message },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    logError("Send message failed", error);
    throw new Error(handleApiError(error, "Failed to send message"));
  }
};

export const getMessages = async (roomId: string, lastMessageTime?: string) => {
  try {
    const url = lastMessageTime
      ? `${API_BASE}/rooms/${roomId}/messages?lastMessageTime=${encodeURIComponent(
          lastMessageTime
        )}`
      : `${API_BASE}/rooms/${roomId}/messages`;

    const response = await axios.get(url, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get messages failed", error);
    throw new Error(handleApiError(error, "Failed to get messages"));
  }
};
