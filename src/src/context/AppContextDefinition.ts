import { createContext } from "react";

// Simplified AppContext - now just provides app-level configuration
export interface AppContextType {
  // Add any app-level configuration here if needed in the future
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
