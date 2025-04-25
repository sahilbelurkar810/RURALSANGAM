import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { checkAuthStatus, logoutUser } from "../services/authServices";

// Define a basic type for the user object (adjust as needed based on your backend response)
// Ensure this User type matches the actual structure returned by your /api/auth/me endpoint
export type User = {
  _id: string;
  name: string;
  email: string;
  role: "volunteer" | "school"; // Or other roles you might have
  // Add other relevant user fields like profile picture, etc.
};

// Define the shape of the context data
// Exporting this type so the useAuth hook can use it
export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Create the context with a default undefined value
// Exporting the context itself so the useAuth hook can access it
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode; // To wrap around other components
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading

  // Check authentication status when the provider mounts
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await checkAuthStatus(); // Call the service
        console.log(userData);

        setUser(userData.user); // Set user data if successful
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
    // Don't necessarily need isLoading here unless logout takes significant time
    // setIsLoading(true);
    try {
      await logoutUser(); // Call the service function
      setUser(null); // Clear user state
    } catch (error) {
      console.error("Logout failed:", error);
      // Rethrow or handle error if needed by the caller
      throw error; // Allow the caller (Navbar) to know if it failed
    } finally {
      // setIsLoading(false);
    }
  };

  // Value provided by the context
  const value = {
    user,
    setUser,
    isLoading,
    logout, // Re-add logout to context value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper hook for consuming the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
