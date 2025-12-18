import { useState } from "react";
import { userService } from "../services/UserService";
import type { User } from "../types";

export const useUserSearch = () => {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = async (
    query: string,
    currentUserId?: number
  ): Promise<User[]> => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const results = await userService.searchUsers(query);
      // Filter out current user from results
      const filteredResults = currentUserId
        ? results.filter((user) => user.id !== currentUserId)
        : results;
      setSearchResults(filteredResults);
      return filteredResults;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search users");
      setSearchResults([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId: number) => {
    try {
      setError(null);
      await userService.followUser(userId);
      // Update the search results to reflect the new follow status
      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFollowing: true } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to follow user");
      throw err;
    }
  };

  const unfollowUser = async (userId: number) => {
    try {
      setError(null);
      await userService.unfollowUser(userId);
      // Update the search results to reflect the new follow status
      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFollowing: false } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unfollow user");
      throw err;
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    searchUsers,
    followUser,
    unfollowUser,
    clearResults,
  };
};
