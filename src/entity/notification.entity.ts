import { ApiProperty } from '@nestjs/swagger';
import { EDashboardState, ENotificationType } from 'src/type/notification.type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'notification' })
export class Notification {
  @PrimaryColumn({ name: 'id', comment: 'id' })
  id: string;

  @ApiProperty({ description: '알림 등록일' })
  @CreateDateColumn({ comment: '알림 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '알림 수정일' })
  @UpdateDateColumn({ comment: '알림 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '알림 삭제일' })
  @DeleteDateColumn({ comment: '알림 삭제일' })
  deletedAt: Date;

  @ApiProperty({
    description: '알림 대상 사용자 ID',
  })
  @Column({ comment: '알림 대상 사용자 ID' })
  userId: string;

  @ApiProperty({
    description: '알림 관련 프로젝트 ID',
    default: null,
    nullable: true,
  })
  @Column({ comment: '알림 관련 프로젝트 ID', default: null, nullable: true })
  projectId: string | null;

  @ApiProperty({
    description: '알림 관련 프로젝트 이름(제목)',
    default: null,
    nullable: true,
  })
  @Column({
    comment: '알림 관련 프로젝트 이름(제목)',
    default: null,
    nullable: true,
  })
  projectName: string | null;

  @ApiProperty({ description: '알림 내용' })
  @Column({ comment: '알림 내용' })
  message: string;

  @ApiProperty({
    description: '알림 종류(PROJECT/COMMENT/APPLY/DEADLINE)',
    enum: ENotificationType,
    default: ENotificationType.PROJECT,
  })
  @Column({
    comment: '알림 종류(PROJECT/COMMENT/APPLY/DEADLINE)',
    enum: ENotificationType,
    default: ENotificationType.PROJECT,
  })
  eduCategory1: ENotificationType;

  @ApiProperty({
    description: '알림 클릭시 이동할 페이지(dashboard/project)',
    example: 'dashboard/project',
    default: '',
  })
  @Column({
    comment: '알림 클릭시 이동할 페이지(dashboard/project)',
    default: '',
  })
  targetPage: string;

  @ApiProperty({
    description: '대시보드 이동시 프로젝트 상태',
    default: null,
    nullable: true,
    enum: EDashboardState,
  })
  @Column({
    comment: '대시보드 이동시 프로젝트 상태',
    default: null,
    nullable: true,
    enum: EDashboardState,
  })
  dashboardState: EDashboardState | null;

  @ApiProperty({ description: '알림 읽음 여부', default: false })
  @Column({ comment: '알림 읽음 여부', default: false })
  isRead: boolean;
}
