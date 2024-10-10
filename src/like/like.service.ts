import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entity/like.entity';
import { IsNull, Repository } from 'typeorm';
import { ClickLikeDto } from './dto/click-like.dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { v4 as uuid } from 'uuid';
import { ProjectService } from 'src/project/project.service';
import { convertTimestampToKST } from 'src/lib/date';

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

    const likeData = await this.likeRepository.findOneBy({
      deletedAt: IsNull(),
      userId,
      projectId,
    });

    if (likeData) {
      return {
        result: false,
      };
    }

    const id = uuid();
    const like = await this.likeRepository.create({
      id,
      userId,
      projectId,
    });

    await this.likeRepository.save(like);

    // NOTE: 프로젝트 총 좋아요 수 업데이트
    await this.projectService.updateLikes(projectId, 1);

    return {
      result: true,
    };
  }

  async unlikeProject(projectId: string, userId: string) {
    const now = new Date();

    const likeData = await this.likeRepository.findOneBy({
      deletedAt: IsNull(),
      userId,
      projectId,
    });

    if (!likeData) {
      return {
        result: false,
      };
    }

    await this.likeRepository.update(likeData.id, {
      deletedAt: now,
    });

    // NOTE: 프로젝트 총 좋아요 수 업데이트
    await this.projectService.updateLikes(projectId, -1);

    return {
      result: true,
    };
  }

  async getProjectUserLike(projectId: string, userId: string) {
    let result = false;

    const dbResult = await this.likeRepository.findOneBy({
      projectId,
      userId,
      deletedAt: IsNull(),
    });

    if (dbResult) {
      result = true;
    }

    return result;
  }

  // NOTE: 사용자별 좋아요한 프로젝트 조회
  async getLikedProjects(userId: string) {
    const dbResult = await this.likeRepository.findBy({
      userId,
      deletedAt: IsNull(),
    });

    const resultArray = dbResult.map((data) => data.projectId);

    return resultArray;
  }

  async likeProjectWithRedis(data: ClickLikeDto, userId: string) {
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

    try {
      // NOTE: 기존에 해당 프로젝트를 찜했는지 여부를 확인
      const isLiked = await this.getProjectUserLike(projectId, userId);

      if (!isLiked) {
        // NOTE: Redis에 특정 사용자가 특정 프로젝트를 클릭한 것을 저장
        await this.redisCacheService.addUserLike(
          likeProjectKey,
          countKey,
          unlikeProjectKey,
          likeUserKey,
          unlikeUserKey,
          userId,
          projectId,
        );
      }

      return {
        result: true,
      };
    } catch (error) {
      // NOTE: Redis 명령 실행 중 에러 발생 시 처리
      console.error('좋아요 관련 Redis Error :', error);
    }
  }

  async unlikeProjectWithRedis(projectId: string, userId: string) {
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

    try {
      // NOTE: 기존에 해당 프로젝트를 찜했는지 여부를 확인
      const isLiked = await this.getProjectUserLike(projectId, userId);

      if (isLiked) {
        // NOTE: Redis에 특정 사용자가 특정 프로젝트를 해지한 것을 저장
        await this.redisCacheService.deleteUserLike(
          likeProjectKey,
          countKey,
          unlikeProjectKey,
          likeUserKey,
          unlikeUserKey,
          userId,
          projectId,
        );
      }

      return {
        result: true,
      };
    } catch (error) {
      // NOTE: Redis 명령 실행 중 에러 발생 시 처리
      console.error('좋아요 관련 Redis Error :', error);
    }
  }

  async getLikesWithRedis(projectId: string) {
    const countKey = `likes:project:${projectId}`;

    // 특정 게시물의 좋아요 수 조회
    const likeCount = await this.redisCacheService.get(countKey);

    const savedLikeCount = await this.projectService.getLikesCount(projectId);

    const addCount =
      likeCount && typeof likeCount === 'string' ? parseInt(likeCount, 10) : 0;

    const totalCount = addCount + savedLikeCount;

    return totalCount;
  }

  async getProjectUserLikeWithRedis(projectId: string, userId: string) {
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
  async getLikedProjectsWithRedis(userId: string) {
    //NOTE: Redis 조회
    const redisLikeResult = await this.redisCacheService.findMembers(
      `user:likeProject:${userId}`,
    );

    const transRedisLikeResult = redisLikeResult.map(
      (data) => data.split('|')[0],
    );

    const redisUnlikeResult = await this.redisCacheService.findMembers(
      `user:unlikeProject:${userId}`,
    );

    const transRedisUnLikeResult = redisUnlikeResult.map(
      (data) => data.split('|')[0],
    );
    const dbResult = await this.likeRepository.findBy({
      userId,
      deletedAt: IsNull(),
    });

    const dbProjectResult = dbResult.map((data) => data.projectId);

    const resultArray = [
      ...new Set([...transRedisLikeResult, ...dbProjectResult]),
    ];

    const filteredArray = resultArray.filter(
      (data) => !transRedisUnLikeResult.includes(data),
    );

    return filteredArray;
  }

  async syncLikesToDB(date: string, userId: string, projectId: string) {
    const id = uuid();

    const time = convertTimestampToKST(Number(date));

    const result = await this.likeRepository.create({
      id,
      createdAt: time,
      userId,
      projectId,
    });
    await this.likeRepository.save(result);
  }

  async syncUnlikesToDB(userId: string, projectId: string) {
    const now = new Date();
    await this.likeRepository.update({ userId, projectId }, { deletedAt: now });
  }
}
