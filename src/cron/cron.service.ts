import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from 'src/notification/notification.service';

@Injectable()
export class CronService {
  constructor(private notificationService: NotificationsService) {}

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
  }
}
