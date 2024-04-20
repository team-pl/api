import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationsService } from './notification.service';
import { GetNotificationsResDto } from './dto/response.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@Controller('notification')
@ApiExtraModels(GetNotificationsResDto)
@ApiTags('Notification')
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

    return { list: data };
  }
}
