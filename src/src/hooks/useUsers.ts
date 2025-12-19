import { useState, useEffect } from "react";
import { userService } from "../services/UserService";
import type { User } from "../types";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await userService.fetchUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Removed auto-fetch on mount - use route-specific hooks instead
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const followUser = async (userId: number) => {
    try {
      setError(null);
      await userService.followUser(userId);
      // Refresh users after follow action
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to follow user");
      throw err;
    }
  };

  const unfollowUser = async (userId: number) => {
    try {
      setError(null);
      await userService.unfollowUser(userId);
      // Refresh users after unfollow action
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unfollow user");
      throw err;
    }
  };

  const searchUsers = async (query: string): Promise<User[]> => {
    try {
      setError(null);
      return await userService.searchUsers(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search users");
      throw err;
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  return {
    users,
    loading,
    error,
    followUser,
    unfollowUser,
    searchUsers,
    refreshUsers,
  };
};
