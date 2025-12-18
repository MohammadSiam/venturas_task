import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Murmur } from "../entities/murmur.entity";
import { Like } from "../entities/like.entity";
import { Follow } from "../entities/follow.entity";
import { User } from "../entities/user.entity";
import { CreateMurmurDto } from "./dto/create-murmur.dto";
import { MurmurResponseDto } from "./dto/murmur-response.dto";

@Injectable()
export class MurmursService {
  constructor(
    @InjectRepository(Murmur)
    private murmursRepository: Repository<Murmur>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(
    userId: number,
    createMurmurDto: CreateMurmurDto
  ): Promise<MurmurResponseDto> {
    const murmur = this.murmursRepository.create({
      userId,
      content: createMurmurDto.content,
    });

    const savedMurmur = await this.murmursRepository.save(murmur);
    return this.toMurmurResponse(savedMurmur, userId);
  }

  async findAll(
    currentUserId?: number,
    page = 1,
    limit = 10
  ): Promise<{
    murmurs: MurmurResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [murmurs, total] = await this.murmursRepository.findAndCount({
      relations: ["user"],
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });

    const murmurResponses = await Promise.all(
      murmurs.map((murmur) => this.toMurmurResponse(murmur, currentUserId))
    );

    return {
      murmurs: murmurResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findTimeline(
    userId: number,
    page = 1,
    limit = 10
  ): Promise<{
    murmurs: MurmurResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    // Get users that the current user follows
    const follows = await this.followsRepository.find({
      where: { followerId: userId },
      select: ["followingId"],
    });

    const followingIds = follows.map((follow) => follow.followingId);
    followingIds.push(userId); // Include own murmurs

    const [murmurs, total] = await this.murmursRepository
      .createQueryBuilder("murmur")
      .leftJoinAndSelect("murmur.user", "user")
      .where("murmur.userId IN (:...followingIds)", { followingIds })
      .orderBy("murmur.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const murmurResponses = await Promise.all(
      murmurs.map((murmur) => this.toMurmurResponse(murmur, userId))
    );

    return {
      murmurs: murmurResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(
    id: number,
    currentUserId?: number
  ): Promise<MurmurResponseDto> {
    const murmur = await this.murmursRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!murmur) {
      throw new NotFoundException("Murmur not found");
    }

    return this.toMurmurResponse(murmur, currentUserId);
  }

  async findByUser(
    userId: number,
    currentUserId?: number,
    page = 1,
    limit = 10
  ): Promise<{
    murmurs: MurmurResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [murmurs, total] = await this.murmursRepository.findAndCount({
      where: { userId },
      relations: ["user"],
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });

    const murmurResponses = await Promise.all(
      murmurs.map((murmur) => this.toMurmurResponse(murmur, currentUserId))
    );

    return {
      murmurs: murmurResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async delete(id: number, userId: number): Promise<void> {
    const murmur = await this.murmursRepository.findOne({ where: { id } });

    if (!murmur) {
      throw new NotFoundException("Murmur not found");
    }

    if (murmur.userId !== userId) {
      throw new ForbiddenException("You can only delete your own murmurs");
    }

    await this.murmursRepository.remove(murmur);
  }

  async like(murmurId: number, userId: number): Promise<void> {
    const murmur = await this.murmursRepository.findOne({
      where: { id: murmurId },
    });
    if (!murmur) {
      throw new NotFoundException("Murmur not found");
    }

    const existingLike = await this.likesRepository.findOne({
      where: { murmurId, userId },
    });

    if (existingLike) {
      // Unlike
      await this.likesRepository.remove(existingLike);
    } else {
      // Like
      const like = this.likesRepository.create({ murmurId, userId });
      await this.likesRepository.save(like);
    }
  }

  private async toMurmurResponse(
    murmur: Murmur,
    currentUserId?: number
  ): Promise<MurmurResponseDto> {
    const likesCount = await this.likesRepository.count({
      where: { murmurId: murmur.id },
    });

    let isLiked = false;
    if (currentUserId) {
      const like = await this.likesRepository.findOne({
        where: { murmurId: murmur.id, userId: currentUserId },
      });
      isLiked = !!like;
    }

    return {
      id: murmur.id,
      content: murmur.content,
      createdAt: murmur.createdAt,
      userId: murmur.userId,
      user: murmur.user
        ? {
            id: murmur.user.id,
            username: murmur.user.username,
            name: murmur.user.name,
            createdAt: murmur.user.createdAt,
          }
        : undefined,
      likesCount,
      isLiked,
    };
  }
}
