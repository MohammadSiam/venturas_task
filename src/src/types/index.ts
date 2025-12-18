export interface User {
  id: number;
  name: string;
  username: string;
  createdAt: Date;
  followingCount?: number;
  followersCount?: number;
  murmursCount?: number;
  isFollowing?: boolean;
}

export interface Murmur {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
  user?: User;
  likesCount: number;
  isLiked?: boolean;
}
