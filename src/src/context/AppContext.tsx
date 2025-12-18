import React, { useState } from "react";
import type { ReactNode } from "react";
import type { User, Murmur } from "../types";
import { initialUsers, initialMurmurs } from "../data/mockData";
import { AppContext } from "./AppContextDefinition";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [murmurs, setMurmurs] = useState<Murmur[]>(initialMurmurs);

  const addMurmur = (text: string) => {
    if (!currentUser) return;

    const newMurmur: Murmur = {
      id: Math.max(...murmurs.map((m) => m.id)) + 1,
      userId: currentUser.id,
      text,
      createdAt: new Date(),
      likedByUserIds: [],
    };

    setMurmurs((prev) => [newMurmur, ...prev]);
  };

  const deleteMurmur = (murmurId: number) => {
    setMurmurs((prev) => prev.filter((m) => m.id !== murmurId));
  };

  const toggleLike = (murmurId: number) => {
    if (!currentUser) return;

    setMurmurs((prev) =>
      prev.map((murmur) => {
        if (murmur.id === murmurId) {
          const isLiked = murmur.likedByUserIds.includes(currentUser.id);
          return {
            ...murmur,
            likedByUserIds: isLiked
              ? murmur.likedByUserIds.filter((id) => id !== currentUser.id)
              : [...murmur.likedByUserIds, currentUser.id],
          };
        }
        return murmur;
      })
    );
  };

  const followUser = (userId: number) => {
    if (!currentUser || userId === currentUser.id) return;

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            followingIds: [...user.followingIds, userId],
          };
        }
        if (user.id === userId) {
          return {
            ...user,
            followerIds: [...user.followerIds, currentUser.id],
          };
        }
        return user;
      })
    );

    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            followingIds: [...prev.followingIds, userId],
          }
        : null
    );
  };

  const unfollowUser = (userId: number) => {
    if (!currentUser) return;

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            followingIds: user.followingIds.filter((id) => id !== userId),
          };
        }
        if (user.id === userId) {
          return {
            ...user,
            followerIds: user.followerIds.filter((id) => id !== currentUser.id),
          };
        }
        return user;
      })
    );

    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            followingIds: prev.followingIds.filter((id) => id !== userId),
          }
        : null
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        murmurs,
        setCurrentUser,
        addMurmur,
        deleteMurmur,
        toggleLike,
        followUser,
        unfollowUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
