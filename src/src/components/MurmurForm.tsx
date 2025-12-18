import React, { useState } from "react";
import { useApp } from "../hooks/useApp";

const MurmurForm: React.FC = () => {
  const [text, setText] = useState("");
  const { addMurmur, currentUser } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && currentUser) {
      addMurmur(text.trim());
      setText("");
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              maxLength={280}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-500">{text.length}/280</span>
              <button
                type="submit"
                disabled={!text.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Murmur
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MurmurForm;
