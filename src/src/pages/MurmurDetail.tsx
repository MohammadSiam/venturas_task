import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useMurmurDetail } from "../hooks/useMurmurDetail";
import MurmurCard from "../components/MurmurCard";

const MurmurDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { murmur, loading, error, toggleLike, deleteMurmur } = useMurmurDetail(
    Number(id)
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg">Loading murmur...</div>
      </div>
    );
  }

  if (error || !murmur || !murmur.user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Murmur Detail</h1>

      <MurmurCard
        murmur={murmur}
        showActions={true}
        onToggleLike={toggleLike}
        onDeleteMurmur={deleteMurmur}
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Murmur Stats</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Posted: {new Date(murmur.createdAt).toLocaleString()}</p>
          <p>Likes: {murmur.likesCount}</p>
          <p>
            Author: {murmur.user.name} (@{murmur.user.username})
          </p>
        </div>
      </div>
    </div>
  );
};

export default MurmurDetail;
