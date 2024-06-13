import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entity/like.entity';
import { IsNull, Repository } from 'typeorm';
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
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
  ) {}

  async likeProject(data: ClickLikeDto, userId: string) {
    const { projectId } = data;

    // NOTE: 특정 사용자가 특정 프로젝트를 클릭한 것을 저장하기 위함
    const likeProjectKey = `likes:users:${projectId}`;

    // NOTE: 특정 프로젝트의 총 좋아요 수를 저장하기 위함
    const countKey = `likes:project:${projectId}`;

    // NOTE: 좋아요 해지 -> 클릭 변환을 위함
    const unlikeProjectKey = `unlikes:users:${projectId}`;

    // NOTE: 사용자별로 좋아요를 클릭한 프로젝트를 저장하기 위함
    const likeUserKey = `user:likeProject:${userId}`;

    // NOTE: 사용자별로 좋아요를 해지한 프로젝트를 저장하기 위함
    const unlikeUserKey = `user:unlikeProject:${userId}`;

    // NOTE: Redis에 특정 사용자가 특정 프로젝트를 클릭한 것을 저장
    const result = await this.redisCacheService.addUserLike(
      likeProjectKey,
      countKey,
      unlikeProjectKey,
      likeUserKey,
      unlikeUserKey,
      userId,
      projectId,
    );

    return {
      result: result,
    };
  }

  async unlikeProject(projectId: string, userId: string) {
    // NOTE: 특정 사용자가 특정 프로젝트를 클릭한 것을 저장하기 위함
    const likeProjectKey = `likes:users:${projectId}`;

    // NOTE: 특정 프로젝트의 총 좋아요 수를 저장하기 위함
    const countKey = `likes:project:${projectId}`;

    // NOTE: 좋아요 해지 -> 클릭 변환을 위함
    const unlikeProjectKey = `unlikes:users:${projectId}`;

    // NOTE: 사용자별로 좋아요를 클릭한 프로젝트를 저장하기 위함
    const likeUserKey = `user:likeProject:${userId}`;

    // NOTE: 사용자별로 좋아요를 해지한 프로젝트를 저장하기 위함
    const unlikeUserKey = `user:unlikeProject:${userId}`;

    // NOTE: Redis에 특정 사용자가 특정 프로젝트를 해지한 것을 저장
    const result = await this.redisCacheService.deleteUserLike(
      likeProjectKey,
      countKey,
      unlikeProjectKey,
      likeUserKey,
      unlikeUserKey,
      userId,
      projectId,
    );

    return {
      result: result,
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

  async getProjectUserLike(projectId: string, userId: string) {
    let result = false;

    const redisResult = await this.redisCacheService.isValueIncluded(
      `likes:users:${projectId}`,
      userId,
    );

    const dbResult = await this.likeRepository.findOneBy({
      projectId,
      userId,
      deletedAt: IsNull(),
    });

    if (redisResult || !!dbResult) {
      result = true;
    }

    return result;
  }

  // NOTE: 사용자별 좋아요한 프로젝트 조회
  async getLikedProjects(userId: string) {
    //NOTE: Redis 조회
    const redisLikeresult = await this.redisCacheService.findMembers(
      `user:likeProject:${userId}`,
    );

    const redisUnlikeresult = await this.redisCacheService.findMembers(
      `user:unlikeProject:${userId}`,
    );

    const dbResult = await this.likeRepository.findBy({
      userId,
      deletedAt: IsNull(),
    });

    const dbProjectResult = dbResult.map((data) => data.projectId);

    const resultArray = [...new Set([...redisLikeresult, ...dbProjectResult])];

    const filteredArray = resultArray.filter(
      (data) => !redisUnlikeresult.includes(data),
    );

    return filteredArray;
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
