import React from "react";
import { Link } from "react-router-dom";
import type { Murmur } from "../types";
import { authUtils } from "../utils/auth";

interface MurmurCardProps {
  murmur: Murmur;
  showActions?: boolean;
  onToggleLike?: (murmurId: number) => Promise<void>;
  onDeleteMurmur?: (murmurId: number) => Promise<void>;
}

const MurmurCard: React.FC<MurmurCardProps> = ({
  murmur,
  showActions = true,
  onToggleLike,
  onDeleteMurmur,
}) => {
  const currentUser = authUtils.getUser();

  const author = murmur.user;
  const isLiked = murmur.isLiked || false;
  const canDelete = currentUser?.id === murmur.userId;

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  };

  const handleToggleLike = async () => {
    if (!onToggleLike) return;
    try {
      await onToggleLike(murmur.id);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteMurmur) return;
    if (window.confirm("Are you sure you want to delete this murmur?")) {
      try {
        await onDeleteMurmur(murmur.id);
      } catch (error) {
        console.error("Failed to delete murmur:", error);
      }
    }
  };

  if (!author) {
    return null;
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-md transition-shadow">
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
              {murmur.content}
            </p>
          </Link>

          {showActions && (
            <div className="flex items-center space-x-4 mt-3">
              <button
                onClick={handleToggleLike}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  isLiked
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "text-gray-500 hover:bg-gray-100 hover:text-red-600"
                }`}
              >
                <span>{isLiked ? "❤️" : "🤍"}</span>
                <span>{murmur.likesCount}</span>
              </button>

              {canDelete && (
                <button
                  onClick={handleDelete}
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
