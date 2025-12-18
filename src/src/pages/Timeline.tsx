import React, { useState } from "react";
import { useApp } from "../hooks/useApp";
import MurmurCard from "../components/MurmurCard";
import MurmurForm from "../components/MurmurForm";
import UserSearch from "../components/UserSearch";
import Pagination from "../components/Pagination";

const Timeline: React.FC = () => {
  const { murmurs, loading } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const murmursPerPage = 10;

  const totalPages = Math.ceil(murmurs.length / murmursPerPage);
  const startIndex = (currentPage - 1) * murmursPerPage;
  const paginatedMurmurs = murmurs.slice(
    startIndex,
    startIndex + murmursPerPage
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg">Loading timeline...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Timeline</h1>

      <UserSearch />

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
