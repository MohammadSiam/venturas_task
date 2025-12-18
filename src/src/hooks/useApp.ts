// Deprecated: Use route-specific hooks instead
// This hook is kept for backward compatibility but should not be used in new code

export const useApp = () => {
  console.warn(
    "useApp is deprecated. Use route-specific hooks like useTimeline, useUserProfile, etc."
  );

  return {
    murmurs: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    loading: false,
    error: null,
    addMurmur: async () => {
      throw new Error("Use useTimeline hook instead");
    },
    deleteMurmur: async () => {
      throw new Error("Use route-specific hooks instead");
    },
    toggleLike: async () => {
      throw new Error("Use route-specific hooks instead");
    },
    refreshMurmurs: async () => {
      throw new Error("Use route-specific hooks instead");
    },
    fetchMurmurs: async () => {
      throw new Error("Use route-specific hooks instead");
    },
    fetchTimeline: async () => {
      throw new Error("Use route-specific hooks instead");
    },
    users: [],
    followUser: async () => {
      throw new Error("Use route-specific hooks instead");
    },
    unfollowUser: async () => {
      throw new Error("Use route-specific hooks instead");
    },
    refreshUsers: async () => {
      throw new Error("Use route-specific hooks instead");
    },
    searchUsers: async () => {
      throw new Error("Use route-specific hooks instead");
    },
  };
};
