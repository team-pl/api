import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notification.service';

@Controller('notification')
@ApiExtraModels()
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly service: NotificationsService) {}
}
