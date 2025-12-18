import React, { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { User, Murmur } from "../types";
import { usersAPI, murmursAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { AppContext } from "./AppContextDefinition";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const refreshUsers = useCallback(async () => {
    try {
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  const refreshMurmurs = useCallback(async () => {
    try {
      setLoading(true);
      if (currentUser) {
        // Get all murmurs instead of just timeline (followed users)
        const murmursData = await murmursAPI.getTimeline();
        setMurmurs(murmursData);
      } else {
        setMurmurs([]);
      }
    } catch (error) {
      console.error("Failed to fetch murmurs:", error);
      setMurmurs([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    const initializeData = async () => {
      if (currentUser) {
        await Promise.all([refreshUsers(), refreshMurmurs()]);
      } else {
        setLoading(false);
        setUsers([]);
        setMurmurs([]);
      }
    };

    initializeData();
  }, [currentUser, refreshUsers, refreshMurmurs]);

  const addMurmur = async (content: string) => {
    if (!currentUser) {
      throw new Error("User must be authenticated to create murmurs");
    }
    try {
      const newMurmur = await murmursAPI.create(content);
      // Add the new murmur to the top of the list immediately for instant feedback
      setMurmurs((prev) => [newMurmur, ...prev]);
      // Also refresh the full list to ensure consistency with all murmurs
      await refreshMurmurs();
    } catch (error) {
      console.error("Failed to create murmur:", error);
      throw error;
    }
  };

  const deleteMurmur = async (murmurId: number) => {
    if (!currentUser) {
      throw new Error("User must be authenticated to delete murmurs");
    }
    try {
      await murmursAPI.delete(murmurId);
      setMurmurs((prev) => prev.filter((m) => m.id !== murmurId));
    } catch (error) {
      console.error("Failed to delete murmur:", error);
      throw error;
    }
  };

  const toggleLike = async (murmurId: number) => {
    if (!currentUser) {
      throw new Error("User must be authenticated to like murmurs");
    }
    try {
      await murmursAPI.toggleLike(murmurId);
      // Refresh murmurs to get updated like status
      await refreshMurmurs();
    } catch (error) {
      console.error("Failed to toggle like:", error);
      throw error;
    }
  };

  const followUser = async (userId: number) => {
    if (!currentUser) {
      throw new Error("User must be authenticated to follow users");
    }
    try {
      await usersAPI.follow(userId);
      await Promise.all([refreshUsers(), refreshMurmurs()]);
    } catch (error) {
      console.error("Failed to follow user:", error);
      throw error;
    }
  };

  const unfollowUser = async (userId: number) => {
    if (!currentUser) {
      throw new Error("User must be authenticated to unfollow users");
    }
    try {
      await usersAPI.unfollow(userId);
      await Promise.all([refreshUsers(), refreshMurmurs()]);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        users,
        murmurs,
        loading,
        addMurmur,
        deleteMurmur,
        toggleLike,
        followUser,
        unfollowUser,
        refreshMurmurs,
        refreshUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
