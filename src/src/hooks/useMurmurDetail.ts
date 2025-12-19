import { useState, useEffect } from "react";
import { murmurService } from "../services/MurmurService";
import type { Murmur } from "../types";

export const useMurmurDetail = (murmurId: number) => {
  const [murmur, setMurmur] = useState<Murmur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchMurmur = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedMurmur = await murmurService.getMurmurById(murmurId);
        if (!isCancelled) {
          setMurmur(fetchedMurmur);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch murmur"
          );
          setMurmur(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    if (murmurId && !isCancelled) {
      fetchMurmur();
    }

    return () => {
      isCancelled = true;
    };
  }, [murmurId]);

  const deleteMurmur = async () => {
    if (!murmur) return;

    try {
      setError(null);
      await murmurService.deleteMurmur(murmur.id);
      setMurmur(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete murmur");
      throw err;
    }
  };

  const toggleLike = async () => {
    if (!murmur) return;

    try {
      setError(null);
      await murmurService.toggleLike(murmur.id);
      // Refresh the murmur to get updated like status
      const updatedMurmur = await murmurService.getMurmurById(murmur.id);
      setMurmur(updatedMurmur);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle like");
      throw err;
    }
  };

  return {
    murmur,
    loading,
    error,
    deleteMurmur,
    toggleLike,
  };
};
