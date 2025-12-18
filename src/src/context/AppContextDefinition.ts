import { createContext } from "react";
import type { User, Murmur } from "../types";

export interface AppContextType {
  users: User[];
  murmurs: Murmur[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  addMurmur: (content: string) => Promise<void>;
  deleteMurmur: (murmurId: number) => Promise<void>;
  toggleLike: (murmurId: number) => Promise<void>;
  followUser: (userId: number) => Promise<void>;
  unfollowUser: (userId: number) => Promise<void>;
  refreshMurmurs: (page?: number, limit?: number) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
