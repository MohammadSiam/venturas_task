import type { User, Murmur } from "../types";

export const initialUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    followingIds: [2, 3],
    followerIds: [2],
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "janesmith",
    followingIds: [1],
    followerIds: [1, 3],
  },
  {
    id: 3,
    name: "Bob Johnson",
    username: "bobjohnson",
    followingIds: [2],
    followerIds: [1],
  },
];

export const initialMurmurs: Murmur[] = [
  {
    id: 1,
    userId: 1,
    text: "Hello world! This is my first murmur.",
    createdAt: new Date("2024-01-15T10:00:00"),
    likedByUserIds: [2],
  },
  {
    id: 2,
    userId: 2,
    text: "Beautiful day today! ☀️",
    createdAt: new Date("2024-01-15T11:30:00"),
    likedByUserIds: [1, 3],
  },
  {
    id: 3,
    userId: 3,
    text: "Working on some exciting projects!",
    createdAt: new Date("2024-01-15T14:20:00"),
    likedByUserIds: [],
  },
  {
    id: 4,
    userId: 1,
    text: "Love this new social platform!",
    createdAt: new Date("2024-01-15T16:45:00"),
    likedByUserIds: [2, 3],
  },
  {
    id: 5,
    userId: 2,
    text: "Just finished reading a great book 📚",
    createdAt: new Date("2024-01-16T09:15:00"),
    likedByUserIds: [1],
  },
];
