import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationsService } from './notification.service';
import {
  DeleteNotificationResDto,
  GetNotificationsResDto,
} from './dto/response.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { DeleteNotificationDto } from './dto/delete-notification.dto';

@Controller('notification')
@ApiExtraModels(
  GetNotificationsResDto,
  DeleteNotificationResDto,
  DeleteNotificationDto,
)
@ApiTags('알림')
export class NotificationController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: '알림 조회 API' })
  @UseGuards(JwtAuthGuard)
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
  async getNotifications(@Request() req, @Query('userId') userId: string) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('user ID NotFound', HttpStatus.UNAUTHORIZED);
    }

    const data = await this.service.getNotifications(userId);

    return data;
  }

  @Delete()
  @ApiOperation({ summary: '알림 삭제 API' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: DeleteNotificationResDto,
  })
  async deleteNotification(
    @Request() req,
    @Body(new ValidationPipe()) data: DeleteNotificationDto,
  ) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('user ID NotFound', HttpStatus.UNAUTHORIZED);
    }

    const { notificationArray } = data;

    return await this.service.deleteNotifications(notificationArray);
  }
}
