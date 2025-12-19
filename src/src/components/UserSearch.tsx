import React, { useState, useEffect } from "react";
import { authUtils } from "../utils/auth";
import { useUserSearch } from "../hooks/useUserSearch";
import type { User } from "../types";

const UserSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [noResultsQueries, setNoResultsQueries] = useState<Set<string>>(
    new Set()
  );
  const currentUser = authUtils.getUser();

  const {
    searchResults,
    loading,
    searchUsers,
    followUser,
    unfollowUser,
    clearResults,
  } = useUserSearch();

  useEffect(() => {
    const trimmed = query.trim();

    // Skip API call if same query with existing results
    if (trimmed === lastQuery && searchResults.length > 0) {
      return;
    }

    // Skip API call if we know this query returns no results
    if (noResultsQueries.has(trimmed.toLowerCase())) {
      return;
    }

    const search = async () => {
      if (trimmed.length < 2) {
        clearResults();
        setLastQuery("");
        // Clear no-results cache when query is too short
        setNoResultsQueries(new Set());
        return;
      }

      try {
        const results = await searchUsers(trimmed, currentUser?.id);
        setLastQuery(trimmed);

        // Track queries that return no results
        if (results.length === 0) {
          setNoResultsQueries(
            (prev) => new Set([...prev, trimmed.toLowerCase()])
          );
        }
      } catch (error) {
        console.error("Search failed:", error);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [
    query,
    searchUsers,
    clearResults,
    currentUser?.id,
    searchResults.length,
    lastQuery,
    noResultsQueries,
  ]);

  // Compute whether to show results dropdown
  const trimmedQuery = query.trim();
  const shouldShowResults =
    isInputFocused &&
    trimmedQuery.length >= 2 &&
    (searchResults.length > 0 ||
      noResultsQueries.has(trimmedQuery.toLowerCase()) ||
      (!loading && lastQuery === trimmedQuery));

  const handleFollowToggle = async (user: User) => {
    try {
      if (user.isFollowing) {
        await unfollowUser(user.id);
      } else {
        await followUser(user.id);
      }
      // Dispatch custom event to notify timeline to refresh
      window.dispatchEvent(new CustomEvent("userFollowChanged"));
    } catch (error) {
      console.error("Follow action failed:", error);
    }
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
          placeholder="Search users..."
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {shouldShowResults && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {searchResults.length > 0
            ? searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollowToggle(user)}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                      user.isFollowing
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {user.isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              ))
            : trimmedQuery.length >= 2 &&
              !loading && (
                <div className="p-4 text-center text-gray-500">
                  No users found for "{trimmedQuery}"
                </div>
              )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
