import { ApiProperty } from '@nestjs/swagger';
import { EApplyState } from 'src/type/apply.type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'apply' })
export class Apply {
  @PrimaryColumn({ name: 'id', comment: 'id' })
  id: string;

  @ApiProperty({ description: '지원 등록일' })
  @CreateDateColumn({ comment: '지원 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '지원 수정일' })
  @UpdateDateColumn({ comment: '지원 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '지원 삭제일' })
  @DeleteDateColumn({ comment: '지원 삭제일' })
  deletedAt: Date;

  @ApiProperty({
    description: '지원한 프로젝트 ID',
  })
  @Column({ comment: '지원한 프로젝트 ID' })
  projectId: string;

  @ApiProperty({
    description: '지원한 사용자 ID',
  })
  @Column({ comment: '지원한 사용자 ID' })
  userId: string;

  @ApiProperty({
    description: '지원한 프로필 ID',
  })
  @Column({ comment: '지원한 프로필 ID' })
  profileId: string;

  @ApiProperty({
    description: '지원 상태',
    default: EApplyState.UNCONFIRMED,
  })
  @Column({ comment: '지원 상태', default: EApplyState.UNCONFIRMED })
  state: EApplyState;

  @ApiProperty({
    description: '지원 내용',
  })
  @Column({ comment: '지원 내용' })
  details: string;
}
