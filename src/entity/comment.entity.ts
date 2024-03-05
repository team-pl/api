import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryColumn({ name: 'id', comment: 'id' })
  id: string;

  @ApiProperty({ description: '댓글 작성일' })
  @CreateDateColumn({ comment: '댓글 작성일' })
  createdAt: Date;

  @ApiProperty({ description: '댓글 수정일' })
  @UpdateDateColumn({ comment: '댓글 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '댓글 삭제일' })
  @DeleteDateColumn({ comment: '댓글 삭제일' })
  deletedAt: Date;

  @ApiProperty({
    description: '댓글을 남긴 프로젝트 ID',
  })
  @Column({ comment: '댓글을 남긴 프로젝트 ID' })
  projectId: string;

  @ApiProperty({
    description: '댓글을 작성한 사용자 ID',
  })
  @Column({ comment: '댓글을 작성한 사용자 ID' })
  userId: string;

  @ApiProperty({ description: '댓글 내용' })
  @Column({ comment: '댓글 내용' })
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];

  @ApiProperty({ description: '댓글을 작성한 사용자 정보' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
