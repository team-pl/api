import { ApiProperty } from '@nestjs/swagger';

export class GetNotificationResDto {
  @ApiProperty({ name: 'id', description: 'id' })
  id: string;

  @ApiProperty({ description: '알림 등록일' })
  createdAt: Date;

  @ApiProperty({
    description: '알림 관련 프로젝트 ID',
    default: null,
    nullable: true,
  })
  projectId: string | null;

  @ApiProperty({ description: '알림 내용' })
  message: string;

  @ApiProperty({ description: '알림 읽음 여부', default: false })
  isRead: boolean;
}

export class GetNotificationsResDto {
  @ApiProperty({ description: '알림 목록', isArray: true })
  list: GetNotificationResDto;
}
