import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationsService } from './notification.service';
import { GetNotificationsResDto } from './dto/response.dto';

@Controller('notification')
@ApiExtraModels(GetNotificationsResDto)
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: '알림 조회 API' })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: '사용자 ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    type: GetNotificationsResDto,
  })
  async getNotifications(@Query('userId') userId: string) {
    const data = await this.service.getNotifications(userId);

    return { list: data };
  }
}
