import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../hooks/useApp";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, users, setCurrentUser } = useApp();
  const location = useLocation();

  const handleUserSwitch = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    setCurrentUser(user || null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-xl font-bold text-blue-500">
                Murmur
              </Link>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Timeline
                </Link>
                {currentUser && (
                  <Link
                    to={`/user/${currentUser.id}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === `/user/${currentUser.id}`
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    My Profile
                  </Link>
                )}
              </div>
            </div>

            {/* User Switcher for Demo */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Switch User:</span>
              <select
                value={currentUser?.id || ""}
                onChange={(e) => handleUserSwitch(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
