import React, { useState, useEffect, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import { useAuth } from "../hooks/useAuth";
import { usersAPI, murmursAPI } from "../services/api";
import MurmurCard from "../components/MurmurCard";
import Pagination from "../components/Pagination";
import type { User, Murmur } from "../types";

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { followUser, unfollowUser } = useApp();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userMurmurs, setUserMurmurs] = useState<Murmur[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const isOwnProfile = currentUser?.id === Number(id);

  const fetchUserData = useCallback(
    async (page = 1, limit = 10) => {
      if (!id) return;

      try {
        setLoading(true);
        const [userData, murmursResponse] = await Promise.all([
          usersAPI.getById(Number(id)),
          murmursAPI.getByUser(Number(id), page, limit),
        ]);

        setUser(userData);
        setUserMurmurs(murmursResponse.murmurs);
        setPagination({
          page: murmursResponse.page,
          limit: murmursResponse.limit,
          total: murmursResponse.total,
          totalPages: murmursResponse.totalPages,
        });

        // Check if current user is following this user
        if (currentUser && currentUser.id !== Number(id)) {
          // This would need to be implemented in the API
          // For now, we'll assume not following
          setIsFollowing(false);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    },
    [id, currentUser]
  );

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handlePageChange = async (page: number) => {
    await fetchUserData(page, pagination.limit);
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !user) return;

    try {
      if (isFollowing) {
        await unfollowUser(user.id);
        setIsFollowing(false);
      } else {
        await followUser(user.id);
        setIsFollowing(true);
      }

      // Refresh user data to get updated counts
      const userData = await usersAPI.getById(user.id);
      setUser(userData);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">@{user.username}</p>
            </div>
          </div>

          {!isOwnProfile && currentUser && (
            <button
              onClick={handleFollowToggle}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                isFollowing
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        <div className="flex space-x-6 mt-4 text-sm">
          <div>
            <span className="font-semibold text-gray-900">
              {user.followingCount || 0}
            </span>
            <span className="text-gray-600 ml-1">Following</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900">
              {user.followersCount || 0}
            </span>
            <span className="text-gray-600 ml-1">Followers</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900">
              {user.murmursCount || pagination.total}
            </span>
            <span className="text-gray-600 ml-1">Murmurs</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isOwnProfile ? "Your Murmurs" : `${user.name}'s Murmurs`}
        </h2>

        {userMurmurs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {isOwnProfile
                ? "You haven't posted any murmurs yet."
                : "This user hasn't posted any murmurs yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {userMurmurs.map((murmur) => (
                <MurmurCard
                  key={murmur.id}
                  murmur={murmur}
                  showActions={true}
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
    </div>
  );
};

export default UserProfile;
