import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/UserService";
import { murmurService } from "../services/MurmurService";
import type { User, Murmur, PaginationData } from "../types";

export const useUserProfile = (userId: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [userMurmurs, setUserMurmurs] = useState<Murmur[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(
    async (page = 1, limit = 10) => {
      try {
        setLoading(true);
        setError(null);

        const [userData, murmursResponse] = await Promise.all([
          userService.getUserById(userId),
          murmurService.getUserMurmurs(userId, page, limit),
        ]);

        setUser(userData);
        setUserMurmurs(murmursResponse.murmurs);
        setPagination({
          page: murmursResponse.page,
          limit: murmursResponse.limit,
          total: murmursResponse.total,
          totalPages: murmursResponse.totalPages,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data"
        );
        setUser(null);
        setUserMurmurs([]);
        setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    let isCancelled = false;

    const loadUserData = async () => {
      if (userId && !isCancelled) {
        await fetchUserData();
      }
    };

    loadUserData();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, fetchUserData]);

  const followUser = async () => {
    if (!user) return;

    try {
      setError(null);
      await userService.followUser(user.id);
      const updatedUser = await userService.getUserById(user.id);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to follow user");
      throw err;
    }
  };

  const unfollowUser = async () => {
    if (!user) return;

    try {
      setError(null);
      await userService.unfollowUser(user.id);
      const updatedUser = await userService.getUserById(user.id);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unfollow user");
      throw err;
    }
  };

  const deleteMurmur = async (murmurId: number) => {
    try {
      setError(null);
      await murmurService.deleteMurmur(murmurId);
      setUserMurmurs((prev) => prev.filter((m) => m.id !== murmurId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete murmur");
      throw err;
    }
  };

  const toggleLike = async (murmurId: number) => {
    try {
      setError(null);
      await murmurService.toggleLike(murmurId);
      await fetchUserData(pagination.page, pagination.limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle like");
      throw err;
    }
  };

  const refreshUserData = async () => {
    await fetchUserData(pagination.page, pagination.limit);
  };

  return {
    user,
    userMurmurs,
    pagination,
    loading,
    error,
    fetchUserData,
    followUser,
    unfollowUser,
    deleteMurmur,
    toggleLike,
    refreshUserData,
  };
};
