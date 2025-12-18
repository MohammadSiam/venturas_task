import React, { useState, useMemo } from "react";
import { useApp } from "../hooks/useApp";
import MurmurCard from "../components/MurmurCard";
import MurmurForm from "../components/MurmurForm";
import Pagination from "../components/Pagination";

const Timeline: React.FC = () => {
  const { currentUser, users, murmurs } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const murmursPerPage = 10;

  const timelineMurmurs = useMemo(() => {
    if (!currentUser) return [];

    // Get murmurs from followed users and own murmurs
    const followingIds = [...currentUser.followingIds, currentUser.id];
    return murmurs
      .filter((murmur) => followingIds.includes(murmur.userId))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [currentUser, murmurs]);

  const totalPages = Math.ceil(timelineMurmurs.length / murmursPerPage);
  const startIndex = (currentPage - 1) * murmursPerPage;
  const paginatedMurmurs = timelineMurmurs.slice(
    startIndex,
    startIndex + murmursPerPage
  );

  const getUserById = (userId: number) => {
    return users.find((user) => user.id === userId);
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Please select a user to view the timeline.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Timeline</h1>

      <MurmurForm />

      {paginatedMurmurs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No murmurs to show. Follow some users or post your first murmur!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedMurmurs.map((murmur) => {
              const author = getUserById(murmur.userId);
              return author ? (
                <MurmurCard key={murmur.id} murmur={murmur} author={author} />
              ) : null;
            })}
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
