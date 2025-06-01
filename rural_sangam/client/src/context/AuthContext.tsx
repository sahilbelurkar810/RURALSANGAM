import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { checkAuthStatus, logoutUser } from "../services/authServices";

// Define basic user type
export type User = {
  _id: string;
  name: string;
  email: string;
  role: "volunteer" | "school";
};

// Define the authenticated user structure with profile
export type AuthUser = {
  user: User;
  profile: any | null; // Using 'any' to accommodate different profile structures
};

// Define the shape of the context data
export interface AuthContextType {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode; // To wrap around other components
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading

  // Check authentication status when the provider mounts
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData: AuthUser = await checkAuthStatus(); // Call the service
        console.log(userData);

        setUser(userData); // Now setting the entire object with user and profile
      } catch (error) {
        // If checkAuthStatus throws (e.g., 401), the user is not logged in
        setUser(null);
        console.error("Auth check failed:", error); // Log for debugging, can be removed
      }
      setIsLoading(false); // Mark loading as complete
    };

    verifyUser();
  }, []); // Empty dependency array means this runs only once on mount

  // Logout function - only handles state and API call
  const logout = async () => {
    try {
      await logoutUser(); // Call the service function
      setUser(null); // Clear user state
    } catch (error) {
      console.error("Logout failed:", error);
      // Rethrow or handle error if needed by the caller
      throw error; // Allow the caller (Navbar) to know if it failed
    }
  };

  // Value provided by the context
  const value = {
    user,
    setUser,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
