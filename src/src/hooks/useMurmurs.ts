import { useState, useEffect } from "react";
import { murmurService } from "../services/MurmurService";
import type { Murmur, PaginationData } from "../types";

export const useMurmurs = () => {
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMurmurs = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await murmurService.fetchMurmurs(page, limit);
      setMurmurs(response.murmurs);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch murmurs");
      setMurmurs([]);
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await murmurService.fetchTimeline(page, limit);
      setMurmurs(response.murmurs);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch timeline");
      setMurmurs([]);
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Removed auto-fetch on mount - use route-specific hooks instead
  // useEffect(() => {
  //   fetchMurmurs();
  // }, []);

  const createMurmur = async (content: string) => {
    try {
      setError(null);
      const newMurmur = await murmurService.createMurmur(content);
      // Refresh the first page to show the new murmur
      await fetchMurmurs(1, pagination.limit);
      return newMurmur;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create murmur");
      throw err;
    }
  };

  const deleteMurmur = async (murmurId: number) => {
    try {
      setError(null);
      await murmurService.deleteMurmur(murmurId);
      // Remove from local state
      setMurmurs((prev) => prev.filter((m) => m.id !== murmurId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete murmur");
      throw err;
    }
  };

  const toggleLike = async (murmurId: number) => {
    try {
      setError(null);
      await murmurService.toggleLike(murmurId);
      // Refresh current page to get updated like status
      await fetchMurmurs(pagination.page, pagination.limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle like");
      throw err;
    }
  };

  const refreshMurmurs = async () => {
    await fetchMurmurs(pagination.page, pagination.limit);
  };

  return {
    murmurs,
    pagination,
    loading,
    error,
    fetchMurmurs,
    fetchTimeline,
    createMurmur,
    deleteMurmur,
    toggleLike,
    refreshMurmurs,
  };
};
