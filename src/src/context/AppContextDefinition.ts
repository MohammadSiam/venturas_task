import { createContext } from "react";
import type { User, Murmur } from "../types";

export interface AppContextType {
  users: User[];
  murmurs: Murmur[];
  loading: boolean;
  addMurmur: (content: string) => Promise<void>;
  deleteMurmur: (murmurId: number) => Promise<void>;
  toggleLike: (murmurId: number) => Promise<void>;
  followUser: (userId: number) => Promise<void>;
  unfollowUser: (userId: number) => Promise<void>;
  refreshMurmurs: () => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
