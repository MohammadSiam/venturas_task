import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Follow } from '../entities/follow.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }
  
  async findOneWithPassword(username: string): Promise<User | null> {
      return this.usersRepository.findOne({ 
          where: { username },
          select: ['id', 'username', 'password']
      });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async follow(followerId: number, followingId: number): Promise<void> {
    if (followerId === followingId) return;
    const existing = await this.followsRepository.findOne({
        where: { followerId, followingId }
    });
    if (existing) return;

    const follow = this.followsRepository.create({ followerId, followingId });
    await this.followsRepository.save(follow);
  }
  
  async unfollow(followerId: number, followingId: number): Promise<void> {
      await this.followsRepository.delete({ followerId, followingId });
  }

  async getProfile(currentUserId: number, userId: number) {
      const user = await this.usersRepository.findOneOrFail({ where: { id: userId } });
      const followingCount = await this.followsRepository.count({ where: { followerId: userId } });
      const followersCount = await this.followsRepository.count({ where: { followingId: userId } });
      
      let isFollowing = false;
      if (currentUserId) {
          const follow = await this.followsRepository.findOne({ where: { followerId: currentUserId, followingId: userId }});
          isFollowing = !!follow;
      }

      return {
          ...user,
          followingCount,
          followersCount,
          isFollowing
      };
  }

  async getFollowers(userId: number) {
      return this.followsRepository.find({
          where: { followingId: userId },
          relations: ['follower']
      });
  }
  
  async getFollowing(userId: number) {
      return this.followsRepository.find({
          where: { followerId: userId },
          relations: ['following']
      });
  }
}
