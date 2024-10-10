import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
// import { LikeService } from 'src/like/like.service';
import { NotificationsService } from 'src/notification/notification.service';
import { ProjectService } from 'src/project/project.service';
// import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class CronService {
  constructor(
    private notificationService: NotificationsService,
    private projectService: ProjectService, // private redisCacheService: RedisCacheService,
  ) // private likeService: LikeService,
  {}

  // NOTE: 매일 1시에 한번씩 알림을 조회하여 30일이 지났는지 확인하여 자동으로 삭제
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cleanUpNotifications() {
    console.log('알림 삭제 크론 시작');

    const deleteList = [];

    const now = new Date();

    // NOTE: 삭제되지 않은 알림 전체 조회
    const list = await this.notificationService.getAllNotification();

    // NOTE: 알림을 조회하여 30일 이상이 지난 알림을 deleteList 변수에 추가
    list.forEach((notiData) => {
      if (
        now.getTime() - notiData.createdAt.getTime() >=
        1000 * 60 * 60 * 24 * 30
      ) {
        deleteList.push(notiData.id);
      }
    });

    console.log('알림 삭제 크론>deleteList :', deleteList);

    // NOTE: deleteList 변수에 있는 값을 delete
    if (deleteList.length) {
      await this.notificationService.deleteNotifications(deleteList);
    }

    console.log('알림 삭제 크론 종료');
  }

  // NOTE: 매일 0시에 한번씩 프로젝트를 조회하여 마감일이 지났는지 확인하여 자동으로 상태 업데이트
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateProjectState() {
    console.log('프로젝트 모집 상태 업데이트 크론 시작');

    const expiredList = await this.projectService.getExpiredProjects();

    const expiredIdList = expiredList.map((value) => value.id);

    console.log('만료된 프로젝트>expiredIdList :', expiredIdList);

    if (expiredIdList.length) {
      await this.projectService.updateExpiredProjects(expiredIdList);
    }

    console.log('프로젝트 모집 상태 업데이트 크론 종료');
  }

  // NOTE: 데이터베이스와 Redis 데이터 동기화 로직 구현
  // @Cron(CronExpression.EVERY_DAY_AT_3AM)
  //   async syncLikesToDatabase() {
  //     console.log('찜 동기화 크론 시작');

  //     const likedResult = await this.redisCacheService.getKeysByPattern(
  //       'likes:users:*',
  //     );

  //     const unlikedResult = await this.redisCacheService.getKeysByPattern(
  //       'unlikes:users:*',
  //     );

  //     const totalCountList = await this.redisCacheService.getTotalCount(
  //       'likes:project:*',
  //     );

  //     const totalLikedUserList = await this.redisCacheService.getKeysByPattern(
  //       'user:likeProject:*',
  //     );

  //     console.log('totalLikedUserList : ', totalLikedUserList);

  //     const totalUnLikedUserList = await this.redisCacheService.getKeysByPattern(
  //       'user:unlikeProject:*',
  //     );

  //     console.log('totalUnLikedUserList : ', totalUnLikedUserList);
  //     // NOTE: 동기화할 Redis 키 리스트 생성
  //     const likeKeysToDelete = likedResult.map(
  //       (value) => `likes:users:${value.projectId}`,
  //     );
  //     const unlikeKeysToDelete = unlikedResult.map(
  //       (value) => `unlikes:users:${value.projectId}`,
  //     );
  //     const totalCountKeysToDelete = totalCountList.map(
  //       (value) => `likes:project:${value.projectId}`,
  //     );
  //     const totalLikeUserKeysToDelete = totalLikedUserList.map(
  //       (value) => `user:likeProject:${value.userId}`,
  //     );
  //     const totalUnLikeUserKeysToDelete = totalUnLikedUserList.map(
  //       (value) => `user:unlikeProject:${value.userId}`,
  //     );

  //     console.log('totalLikeUserKeysToDelete :', totalLikeUserKeysToDelete);

  //     // NOTE: 좋아요 생성
  //     likedResult.forEach(async (value) => {
  //       const [userId, timeStamp] = value.userId.split('|');
  //       await this.likeService.syncLikesToDB(timeStamp, userId, value.projectId);
  //     });

  //     // NOTE: 좋아요 해지 반영
  //     unlikedResult.forEach(async (value) => {
  //       await this.likeService.syncUnlikesToDB(value.userId, value.projectId);
  //     });

  //     // NOTE: 총 좋아요 수 프로젝트 테이블 동기화
  //     totalCountList.forEach(async (value) => {
  //       await this.projectService.updateLikes(
  //         value.projectId,
  //         Number(value.totalCount),
  //       );
  //     });

  //     // NOTE: 동기화 후 Redis에서 해당 키 제거
  //     await this.redisCacheService.removeKeys([
  //       ...likeKeysToDelete,
  //       ...unlikeKeysToDelete,
  //       ...totalCountKeysToDelete,
  //       ...totalLikeUserKeysToDelete,
  //       ...totalUnLikeUserKeysToDelete,
  //     ]);

  //     console.log('찜 동기화 크론 종료');
  //   }
}
