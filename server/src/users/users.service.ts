import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Follow } from "../entities/follow.entity";
import { Murmur } from "../entities/murmur.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
    @InjectRepository(Murmur)
    private murmursRepository: Repository<Murmur>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.toUserResponse(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return Promise.all(
      users.map((user) => this.toUserResponseWithCounts(user))
    );
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.toUserResponseWithCounts(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      select: ["id", "username", "name", "password", "createdAt"],
    });
  }

  async follow(followerId: number, followingId: number): Promise<void> {
    if (followerId === followingId) {
      throw new ConflictException("Cannot follow yourself");
    }

    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
    });
    const following = await this.usersRepository.findOne({
      where: { id: followingId },
    });

    if (!follower || !following) {
      throw new NotFoundException("User not found");
    }

    const existingFollow = await this.followsRepository.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      throw new ConflictException("Already following this user");
    }

    const follow = this.followsRepository.create({ followerId, followingId });
    await this.followsRepository.save(follow);
  }

  async unfollow(followerId: number, followingId: number): Promise<void> {
    const follow = await this.followsRepository.findOne({
      where: { followerId, followingId },
    });

    if (!follow) {
      throw new NotFoundException("Follow relationship not found");
    }

    await this.followsRepository.remove(follow);
  }

  async getFollowing(userId: number): Promise<UserResponseDto[]> {
    const follows = await this.followsRepository.find({
      where: { followerId: userId },
      relations: ["following"],
    });

    return Promise.all(
      follows.map((follow) => this.toUserResponseWithCounts(follow.following))
    );
  }

  async getFollowers(userId: number): Promise<UserResponseDto[]> {
    const follows = await this.followsRepository.find({
      where: { followingId: userId },
      relations: ["follower"],
    });

    return Promise.all(
      follows.map((follow) => this.toUserResponseWithCounts(follow.follower))
    );
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.followsRepository.findOne({
      where: { followerId, followingId },
    });
    return !!follow;
  }

  async searchUsers(query: string): Promise<UserResponseDto[]> {
    const users = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.username LIKE :query OR user.name LIKE :query", {
        query: `%${query}%`,
      })
      .limit(10)
      .getMany();

    return Promise.all(
      users.map((user) => this.toUserResponseWithCounts(user))
    );
  }

  async searchUsersWithFollowStatus(
    query: string,
    currentUserId: number
  ): Promise<UserResponseDto[]> {
    const users = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.username LIKE :query OR user.name LIKE :query", {
        query: `%${query}%`,
      })
      .andWhere("user.id != :currentUserId", { currentUserId })
      .limit(10)
      .getMany();

    const usersWithFollowStatus = await Promise.all(
      users.map(async (user) => {
        const userResponse = await this.toUserResponseWithCounts(user);
        const isFollowing = await this.isFollowing(currentUserId, user.id);
        return {
          ...userResponse,
          isFollowing,
        };
      })
    );

    return usersWithFollowStatus;
  }

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  private async toUserResponseWithCounts(user: User): Promise<UserResponseDto> {
    const [followingCount, followersCount, murmursCount] = await Promise.all([
      this.followsRepository.count({ where: { followerId: user.id } }),
      this.followsRepository.count({ where: { followingId: user.id } }),
      this.murmursRepository.count({ where: { userId: user.id } }),
    ]);

    return {
      ...this.toUserResponse(user),
      followingCount,
      followersCount,
      murmursCount,
    };
  }
}
