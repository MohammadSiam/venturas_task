import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Murmur } from '../entities/murmur.entity';
import { Like } from '../entities/like.entity';
import { Follow } from '../entities/follow.entity';

@Injectable()
export class MurmursService {
  constructor(
    @InjectRepository(Murmur)
    private murmursRepository: Repository<Murmur>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
  ) {}

  async create(userId: number, content: string): Promise<Murmur> {
    const murmur = this.murmursRepository.create({ userId, content });
    return this.murmursRepository.save(murmur);
  }

  async findAll(): Promise<Murmur[]> {
    return this.murmursRepository.find({ relations: ['user', 'likes'] });
  }

  async findTimeline(userId: number, page: number = 1): Promise<any> {
      // Get IDs of users followed by current user
      const following = await this.followsRepository.find({ where: { followerId: userId } });
      const followingIds = following.map(f => f.followingId);
      
      // Add own ID to include own murmurs
      followingIds.push(userId);

      const take = 10;
      const skip = (page - 1) * take;

      const [result, total] = await this.murmursRepository.findAndCount({
          where: { userId: In(followingIds) },
          order: { createdAt: 'DESC' },
          take,
          skip,
          relations: ['user', 'likes']
      });

      // Map likes to count and check if liked by current user
      const murmurs = result.map(m => {
          const likeCount = m.likes.length;
          const isLiked = m.likes.some(l => l.userId === userId);
          return {
              ...m,
              likeCount,
              isLiked
          };
      });

      return {
          data: murmurs,
          total,
          page,
          lastPage: Math.ceil(total / take)
      };
  }

  async findByUserId(currentUserId: number, targetUserId: number): Promise<Murmur[]> {
      const murmurs = await this.murmursRepository.find({
          where: { userId: targetUserId },
          order: { createdAt: 'DESC' },
          relations: ['user', 'likes']
      });
      
      return murmurs.map(m => {
           const likeCount = m.likes.length;
           const isLiked = m.likes.some(l => l.userId === currentUserId);
           return {
               ...m,
               likeCount,
               isLiked
           } as any;
      });
  }

  async remove(userId: number, id: number): Promise<void> {
    const murmur = await this.murmursRepository.findOne({ where: { id } });
    if (!murmur) throw new NotFoundException('Murmur not found');
    if (murmur.userId !== userId) throw new ForbiddenException('You can only delete your own murmurs');
    
    await this.murmursRepository.remove(murmur);
  }

  async like(userId: number, murmurId: number): Promise<void> {
      const existing = await this.likesRepository.findOne({ where: { userId, murmurId } });
      if (existing) return;
      
      const like = this.likesRepository.create({ userId, murmurId });
      await this.likesRepository.save(like);
  }
}
