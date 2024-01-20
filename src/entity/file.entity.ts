import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'file' })
export class File {
  @PrimaryColumn({ name: 'id', comment: 'id' })
  id: string;

  @ApiProperty({ description: '파일 업로드일' })
  @CreateDateColumn({ comment: '파일 업로드일' })
  createdAt: Date;

  @ApiProperty({ description: '파일 수정일' })
  @UpdateDateColumn({ comment: '파일 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '파일 삭제일' })
  @DeleteDateColumn({ comment: '파일 삭제일' })
  deletedAt: Date;

  @ApiProperty({ description: '파일을 업로드한 사용자 ID' })
  @Column({ comment: '파일을 업로드한 사용자 ID' })
  userId: string;

  @ApiProperty({ description: '파일 url' })
  @Column({ comment: '파일 url' })
  url: string;
}
