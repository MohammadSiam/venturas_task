import React, { useState, useEffect } from "react";
import { usersAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useApp } from "../hooks/useApp";
import type { User } from "../types";

const UserSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { user: currentUser } = useAuth();
  const { followUser, unfollowUser } = useApp();

  useEffect(() => {
    const searchUsers = async () => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await usersAPI.search(query.trim());
        // Filter out current user from results
        const filteredResults = results.filter(
          (user) => user.id !== currentUser?.id
        );
        setSearchResults(filteredResults);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, currentUser?.id]);

  const handleFollow = async (userId: number) => {
    try {
      await followUser(userId);
      // Update the search results to reflect the new follow status
      const updatedResults = await usersAPI.search(query.trim());
      const filteredResults = updatedResults.filter(
        (user) => user.id !== currentUser?.id
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleUnfollow = async (userId: number) => {
    try {
      await unfollowUser(userId);
      // Update the search results to reflect the new follow status
      const updatedResults = await usersAPI.search(query.trim());
      const filteredResults = updatedResults.filter(
        (user) => user.id !== currentUser?.id
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
  };

  const isFollowing = (user: User): boolean => {
    return user.isFollowing || false;
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search users by name or username..."
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
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
        </div>
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                  <p className="text-xs text-gray-500">
                    {user.followersCount || 0} followers
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  isFollowing(user)
                    ? handleUnfollow(user.id)
                    : handleFollow(user.id)
                }
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  isFollowing(user)
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isFollowing(user) ? "Unfollow" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      )}

      {showResults &&
        query.trim().length >= 2 &&
        searchResults.length === 0 &&
        !isSearching && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <p className="text-gray-500 text-center">
              No users found for "{query}"
            </p>
          </div>
        )}
    </div>
  );
};

export default UserSearch;
