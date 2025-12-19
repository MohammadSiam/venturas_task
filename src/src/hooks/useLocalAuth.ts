import { useState, useEffect } from "react";
import { authAPI } from "../services/api";
import type { User } from "../types";

// Simple localStorage-based auth without context
export const useLocalAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const cachedUser = localStorage.getItem("user");

      if (token && cachedUser) {
        try {
          // Use cached user data to avoid API call
          const userData = JSON.parse(cachedUser);
          setUser(userData);
        } catch (error) {
          // If cached data is invalid, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [isInitialized]);

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);
      const { access_token, user: userData } = response;

      // Store both token and user data
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const userData = await authAPI.getMe();
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      // Token is invalid, logout
      logout();
      throw error;
    }
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token") && !!user;
  };

  return {
    user,
    isLoading,
    login,
    logout,
    refreshUser,
    getToken,
    isAuthenticated,
  };
};
