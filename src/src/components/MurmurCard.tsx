import React from "react";
import { Link } from "react-router-dom";
import type { Murmur, User } from "../types";
import { useApp } from "../hooks/useApp";

interface MurmurCardProps {
  murmur: Murmur;
  author: User;
  showActions?: boolean;
}

const MurmurCard: React.FC<MurmurCardProps> = ({
  murmur,
  author,
  showActions = true,
}) => {
  const { currentUser, toggleLike, deleteMurmur } = useApp();

  const isLiked = currentUser
    ? murmur.likedByUserIds.includes(currentUser.id)
    : false;
  const canDelete = currentUser?.id === murmur.userId;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="bg-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {author.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Link
              to={`/user/${author.id}`}
              className="font-semibold text-gray-900 hover:text-blue-600"
            >
              {author.name}
            </Link>
            <span className="text-gray-500 text-sm">@{author.username}</span>
            <span className="text-gray-400 text-sm">·</span>
            <span className="text-gray-500 text-sm">
              {formatDate(murmur.createdAt)}
            </span>
          </div>

          <Link to={`/murmur/${murmur.id}`} className="block mt-2">
            <p className="text-gray-900 whitespace-pre-wrap hover:text-gray-700">
              {murmur.text}
            </p>
          </Link>

          {showActions && (
            <div className="flex items-center space-x-4 mt-3">
              <button
                onClick={() => toggleLike(murmur.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  isLiked
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "text-gray-500 hover:bg-gray-100 hover:text-red-600"
                }`}
              >
                <span>{isLiked ? "❤️" : "🤍"}</span>
                <span>{murmur.likedByUserIds.length}</span>
              </button>

              {canDelete && (
                <button
                  onClick={() => deleteMurmur(murmur.id)}
                  className="text-gray-500 hover:text-red-600 text-sm px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MurmurCard;
