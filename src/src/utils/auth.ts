import type { User } from "../types";

// Simple auth utilities that work with localStorage directly
export const authUtils = {
  getToken(): string | null {
    return localStorage.getItem("token");
  },

  getUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setAuth(token: string, user: User): void {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  clearAuth(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  },
};
