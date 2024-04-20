import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entity/notification.entity';
import { IsNull, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Time } from 'src/lib/date';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(data: CreateNotificationDto) {
    const id = uuid();

    const { userId, message, projectId } = data;

    const notiData = await this.notificationRepository.create({
      id,
      userId,
      message,
      projectId,
      isRead: false,
    });

    await this.notificationRepository.save(notiData);

    return true;
  }

  async getNotifications(userId: string) {
    const now = new Date();
    const oneMonthBefore = now.getTime() - Time.oneMonthBefore;

    await this.notificationRepository.update(
      { userId, deletedAt: IsNull() },
      { isRead: true },
    );

    // NOTE: 30일 이후의 알림만 가져오도록 함
    const data = await this.notificationRepository.findBy({
      deletedAt: IsNull(),
      userId,
      createdAt: MoreThanOrEqual(new Date(oneMonthBefore)),
    });

    return data;
  }
}
