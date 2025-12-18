import { createContext } from "react";
import type { User, Murmur } from "../types";

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  murmurs: Murmur[];
  setCurrentUser: (user: User | null) => void;
  addMurmur: (text: string) => void;
  deleteMurmur: (murmurId: number) => void;
  toggleLike: (murmurId: number) => void;
  followUser: (userId: number) => void;
  unfollowUser: (userId: number) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
