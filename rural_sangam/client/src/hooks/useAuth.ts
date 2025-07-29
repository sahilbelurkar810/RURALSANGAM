import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

// Custom hook for easy access to the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  // We explicitly type the return value because the context default is undefined
  // hook should only ever be called within the provider where context is defined.
  return context;
};
