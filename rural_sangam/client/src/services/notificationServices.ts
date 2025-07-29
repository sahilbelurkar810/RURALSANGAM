import axios from "axios";
import { handleApiError, logError } from "../utils/errorHandling";

// Base API URL
const API_BASE = import.meta.env.VITE_API_URL;

// Types
export type Notification = {
  _id: string;
  recipient: string;
  sender?: {
    _id: string;
    name: string;
    email: string;
  };
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

// Notification Services

// Get all notifications for current user
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${API_BASE}/notifications`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    logError("Get notifications failed", error);
    throw new Error(handleApiError(error, "Failed to get notifications"));
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/notifications/${notificationId}/read`, 
      {}, 
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    logError("Mark notification as read failed", error);
    throw new Error(handleApiError(error, "Failed to mark notification as read"));
  }
};

// Helper function to get unread notification count
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const notifications = await getNotifications();
    return notifications.filter(notification => !notification.isRead).length;
  } catch (error) {
    logError("Get unread notification count failed", error);
    return 0; // Return 0 on error to avoid breaking UI
  }
};
