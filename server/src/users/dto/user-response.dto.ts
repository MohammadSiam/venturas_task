export class UserResponseDto {
  id!: number;
  username!: string;
  name!: string;
  createdAt!: Date;
  followingCount?: number;
  followersCount?: number;
  murmursCount?: number;
  isFollowing?: boolean;
}
