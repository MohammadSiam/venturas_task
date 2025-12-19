import React, { useState, useEffect } from "react";
import { useTimeline } from "../hooks/useTimeline";
import MurmurCard from "../components/MurmurCard";
import MurmurForm from "../components/MurmurForm";
import UserSearch from "../components/UserSearch";
import Pagination from "../components/Pagination";

const Timeline: React.FC = () => {
  const {
    murmurs,
    loading,
    pagination,
    fetchMurmurs,
    refreshMurmurs,
    createMurmur,
    toggleLike,
    deleteMurmur,
  } = useTimeline();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Set initial last updated time when murmurs load
  useEffect(() => {
    if (murmurs.length > 0 && !lastUpdated) {
      setLastUpdated(new Date());
    }
  }, [murmurs.length, lastUpdated]);

  // Listen for user follow changes and refresh timeline
  useEffect(() => {
    const handleUserFollowChanged = () => {
      refreshMurmurs();
      setLastUpdated(new Date());
    };

    window.addEventListener("userFollowChanged", handleUserFollowChanged);

    return () => {
      window.removeEventListener("userFollowChanged", handleUserFollowChanged);
    };
  }, [refreshMurmurs]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshMurmurs();
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePageChange = async (page: number) => {
    await fetchMurmurs(page, pagination.limit);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg">Loading timeline...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Murmurs</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      <UserSearch />

      <MurmurForm onCreateMurmur={createMurmur} />

      {murmurs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No murmurs yet. Be the first to post something!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {murmurs.map((murmur) => (
              <MurmurCard
                key={murmur.id}
                murmur={murmur}
                onToggleLike={toggleLike}
                onDeleteMurmur={deleteMurmur}
              />
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Timeline;
