import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteNotificationDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: '삭제 대상 알림 ID 배열',
    type: 'array',
  })
  notificationArray: string[];
}
