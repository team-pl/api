import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entity/like.entity';
import { Repository } from 'typeorm';
import { ClickLikeDto } from './dto/click-like.dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuid } from 'uuid';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private readonly redisCacheService: RedisCacheService,
    private readonly projectService: ProjectService,
  ) {}

  async likeProject(data: ClickLikeDto, userId: string) {
    const { projectId } = data;

    // NOTE: 특정 사용자가 특정 프로젝트를 클릭한 것을 저장하기 위함
    const usersKey = `likes:users:${projectId}`;

    // NOTE: 특정 프로젝트의 총 좋아요 수를 저장하기 위함
    const countKey = `likes:project:${projectId}`;

    // NOTE: 좋아요 해지 -> 클릭 변환을 위함
    const unlikeKey = `unlikes:users:${projectId}`;

    // NOTE: Redis에 특정 사용자가 특정 프로젝트를 클릭한 것을 저장
    const { isMember } = await this.redisCacheService.addUserLike(
      usersKey,
      userId,
      unlikeKey,
    );

    // 좋아요 추가
    const totalResult = await this.redisCacheService.increment(
      countKey,
      isMember,
    );

    return {
      result: totalResult,
    };
  }

  async unlikeProject(projectId: string, userId: string) {
    // NOTE: 특정 사용자가 특정 프로젝트를 클릭 해지한 것을 저장하기 위함
    const usersKey = `likes:users:${projectId}`;

    // NOTE: 특정 프로젝트의 총 좋아요 수를 저장하기 위함
    const countKey = `likes:project:${projectId}`;

    // NOTE: 좋아요 해지 -> 클릭 변환을 위함
    const unlikeKey = `unlikes:users:${projectId}`;

    // NOTE: Redis에 특정 사용자가 특정 프로젝트를 해지한 것을 저장
    const { isMember } = await this.redisCacheService.deleteUserLike(
      usersKey,
      userId,
      unlikeKey,
    );

    // 좋아요 추가
    const totalResult = await this.redisCacheService.decrement(
      countKey,
      isMember,
    );

    return {
      result: totalResult,
    };
  }

  // NOTE: 총 좋아요 수 확인
  async getLikes(projectId: string) {
    const countKey = `likes:project:${projectId}`;

    // 특정 게시물의 좋아요 수 조회
    const likeCount = await this.redisCacheService.get(countKey);

    const savedLikeCount = await this.projectService.getLikesCount(projectId);

    const addCount =
      likeCount && typeof likeCount === 'string' ? parseInt(likeCount, 10) : 0;

    const totalCount = addCount + savedLikeCount;

    return totalCount;
  }

  // NOTE: 데이터베이스와 Redis 데이터 동기화 로직 구현
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async syncLikesToDatabase() {
    const now = new Date();

    console.log('Cron 스케쥴링 시작');

    const likedResult = await this.redisCacheService.getKeysByPattern(
      'likes:users:',
    );

    const unlikedResult = await this.redisCacheService.getKeysByPattern(
      'unlikes:users:',
    );

    const totalCountList = await this.redisCacheService.getTotalCount(
      'likes:project:',
    );

    // NOTE: 좋아요 생성
    likedResult.forEach(async (value) => {
      const id = uuid();
      const result = await this.likeRepository.create({
        id,
        userId: value.userId,
        projectId: value.projectId,
      });
      await this.likeRepository.save(result);
    });

    // NOTE: 좋아요 해지 반영
    unlikedResult.forEach(async (value) => {
      await this.likeRepository.update(
        { userId: value.userId, projectId: value.projectId },
        { deletedAt: now },
      );
    });

    // NOTE: 총 좋아요 수 프로젝트 테이블 동기화

    totalCountList.forEach(async (value) => {
      await this.projectService.updateLikes(
        value.projectId,
        Number(value.totalCount),
      );
    });
  }
}
