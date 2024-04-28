import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({ description: '알림 읽음 여부', default: false })
  @Column({ comment: '알림 읽음 여부', default: false })
  isRead: boolean;
}
