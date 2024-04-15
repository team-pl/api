import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entity/notification.entity';
import { IsNull, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateNotificationDto } from './dto/create-notification.dto';

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
    const data = await this.notificationRepository.findBy({
      deletedAt: IsNull(),
      userId,
    });

    return data;
  }
}
