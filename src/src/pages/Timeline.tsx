import React, { useState, useEffect } from "react";
import { useApp } from "../hooks/useApp";
import MurmurCard from "../components/MurmurCard";
import MurmurForm from "../components/MurmurForm";
import UserSearch from "../components/UserSearch";
import Pagination from "../components/Pagination";

const Timeline: React.FC = () => {
  const { murmurs, loading, refreshMurmurs } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const murmursPerPage = 10;

  const totalPages = Math.ceil(murmurs.length / murmursPerPage);
  const startIndex = (currentPage - 1) * murmursPerPage;
  const paginatedMurmurs = murmurs.slice(
    startIndex,
    startIndex + murmursPerPage
  );

  // Set initial last updated time when murmurs load
  useEffect(() => {
    if (murmurs.length > 0 && !lastUpdated) {
      setLastUpdated(new Date());
    }
  }, [murmurs.length, lastUpdated]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshMurmurs();
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">All Murmurs</h1>
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

      <MurmurForm />

      {paginatedMurmurs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No murmurs yet. Be the first to post something!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedMurmurs.map((murmur) => (
              <MurmurCard key={murmur.id} murmur={murmur} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Timeline;
