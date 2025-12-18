import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import MurmurCard from "../components/MurmurCard";

const MurmurDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { murmurs } = useApp();

  const murmur = murmurs.find((m) => m.id === Number(id));

  if (!murmur || !murmur.user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Murmur Detail</h1>

      <MurmurCard murmur={murmur} showActions={true} />

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
