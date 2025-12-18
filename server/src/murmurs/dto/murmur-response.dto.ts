import { UserResponseDto } from "../../users/dto/user-response.dto";

export class MurmurResponseDto {
  id!: number;
  content!: string;
  createdAt!: Date;
  userId!: number;
  user?: UserResponseDto;
  likesCount!: number;
  isLiked?: boolean;
}
