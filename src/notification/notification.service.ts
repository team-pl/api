import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entity/notification.entity';
import { IsNull, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { EDashboardState, ENotificationType } from 'src/type/notification.type';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(data: CreateNotificationDto) {
    const id = uuid();

    const { userId, message, projectId, projectName } = data;

    const notiData = await this.notificationRepository.create({
      id,
      userId,
      message,
      projectId,
      projectName,
      isRead: false,
    });

    await this.notificationRepository.save(notiData);

    return true;
  }

  // NOTE: 댓글 등록시 사용할 알림 등록 함수
  async createForComment(
    userId: string,
    message: string,
    projectId: string,
    projectName: string,
    targetPage: string,
  ) {
    const id = uuid();

    const notiData = await this.notificationRepository.create({
      id,
      userId,
      message,
      projectId,
      projectName,
      targetPage,
      type: ENotificationType.COMMENT,
      isRead: false,
    });

    await this.notificationRepository.save(notiData);

    return true;
  }

  // NOTE: 프로젝트 지원시 사용할 알림 등록 함수
  async createForApply({
    userId,
    message,
    projectId,
    projectName,
    targetPage,
    dashboardState,
  }: {
    userId: string;
    message: string;
    projectId: string;
    projectName: string;
    targetPage: string;
    dashboardState: EDashboardState;
  }) {
    const id = uuid();

    const notiData = await this.notificationRepository.create({
      id,
      userId,
      message,
      projectId,
      projectName,
      targetPage,
      dashboardState,
      type: ENotificationType.APPLY,
      isRead: false,
    });

    await this.notificationRepository.save(notiData);

    return true;
  }

  async getNotifications(userId: string) {
    // NOTE: 30일 이후의 알림만 가져오도록 함
    const data = await this.notificationRepository.find({
      where: {
        deletedAt: IsNull(),
        userId,
      },
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'createdAt',
        'isRead',
        'projectName',
        'message',
        'projectId',
        'targetPage',
        'dashboardState',
        'type',
      ],
    });

    const hasUnreadNotification = !data[0].isRead;

    await this.notificationRepository.update(
      { userId, deletedAt: IsNull() },
      { isRead: true },
    );

    return {
      list: data,
      hasUnreadNotification,
    };
  }

  async deleteNotifications(deleteArray: string[]) {
    const now = new Date();
    await this.notificationRepository.update(deleteArray, { deletedAt: now });
    return true;
  }

  async getAllNotification() {
    const notificationList = await this.notificationRepository.findBy({
      deletedAt: IsNull(),
    });

    return notificationList;
  }
}
