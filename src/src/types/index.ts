export interface User {
  id: number;
  name: string;
  username: string;
  followingIds: number[];
  followerIds: number[];
}

export interface Murmur {
  id: number;
  userId: number;
  text: string;
  createdAt: Date;
  likedByUserIds: number[];
}
