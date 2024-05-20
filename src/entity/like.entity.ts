import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'like' })
export class Like {
  @PrimaryColumn({ name: 'id', comment: 'id' })
  id: string;

  @ApiProperty({ description: '클릭일' })
  @CreateDateColumn({ comment: '클릭일' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ comment: '수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '클릭 해지일' })
  @DeleteDateColumn({ comment: '클릭 해지일' })
  deletedAt: Date;

  @ApiProperty({ description: '좋아요를 누른 사용자 ID (user_entity.id)' })
  @Column({ comment: '좋아요를 누른 사용자 ID (user_entity.id)' })
  userId: string;

  @ApiProperty({ description: '좋아요를 누른 프로젝트 ID (project_entity.id)' })
  @Column({
    comment: '좋아요를 누른 프로젝트 ID (project_entity.id)',
  })
  projectId: string;
}
