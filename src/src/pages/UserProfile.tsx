import React, { useState, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import MurmurCard from "../components/MurmurCard";
import Pagination from "../components/Pagination";

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, users, murmurs, followUser, unfollowUser } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const murmursPerPage = 10;

  const user = users.find((u) => u.id === Number(id));
  const isOwnProfile = currentUser?.id === Number(id);
  const isFollowing = currentUser?.followingIds.includes(Number(id)) || false;

  const userMurmurs = useMemo(() => {
    if (!user) return [];
    return murmurs
      .filter((murmur) => murmur.userId === user.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [user, murmurs]);

  const totalPages = Math.ceil(userMurmurs.length / murmursPerPage);
  const startIndex = (currentPage - 1) * murmursPerPage;
  const paginatedMurmurs = userMurmurs.slice(
    startIndex,
    startIndex + murmursPerPage
  );

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleFollowToggle = () => {
    if (!currentUser) return;

    if (isFollowing) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

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
              {user.followingIds.length}
            </span>
            <span className="text-gray-600 ml-1">Following</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900">
              {user.followerIds.length}
            </span>
            <span className="text-gray-600 ml-1">Followers</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900">
              {userMurmurs.length}
            </span>
            <span className="text-gray-600 ml-1">Murmurs</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isOwnProfile ? "Your Murmurs" : `${user.name}'s Murmurs`}
        </h2>

        {paginatedMurmurs.length === 0 ? (
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
              {paginatedMurmurs.map((murmur) => (
                <MurmurCard
                  key={murmur.id}
                  murmur={murmur}
                  author={user}
                  showActions={true}
                />
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
    </div>
  );
};

export default UserProfile;
