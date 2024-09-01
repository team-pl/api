import { ApiProperty } from '@nestjs/swagger';
import { EDashboardState, ENotificationType } from 'src/type/notification.type';

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

  @ApiProperty({
    description: '알림 관련 프로젝트 이름(제목)',
    default: null,
    nullable: true,
  })
  projectName: string | null;

  @ApiProperty({
    description: '알림 클릭시 이동할 페이지(dashboard/project)',
    example: 'dashboard/project',
    default: '',
  })
  targetPage: string;

  @ApiProperty({
    description: '대시보드 이동시 프로젝트 상태',
    default: null,
    nullable: true,
    enum: EDashboardState,
  })
  dashboardState: EDashboardState | null;

  @ApiProperty({
    description: '알림 종류(PROJECT/COMMENT/APPLY/DEADLINE)',
    enum: ENotificationType,
    default: ENotificationType.PROJECT,
  })
  type: ENotificationType;

  @ApiProperty({ description: '알림 읽음 여부', default: false })
  isRead: boolean;
}

export class GetNotificationsResDto {
  @ApiProperty({ description: '알림 목록', isArray: true })
  list: GetNotificationResDto;
  @ApiProperty({ description: '읽지 않은 알림이 있는지 여부' })
  hasUnreadNotification: boolean;
}

export class DeleteNotificationResDto {
  @ApiProperty({ description: '알림 삭제 결과' })
  result: boolean;
}
