import { ApiProperty } from '@nestjs/swagger';

export class PostCommentResDto {
  @ApiProperty({ description: '댓글 고유 ID' })
  id: string;

  @ApiProperty({ description: '댓글 등록일' })
  createdAt: Date;

  @ApiProperty({
    description: '댓글을 작성한 사용자 ID',
  })
  userId: string;

  @ApiProperty({
    description: '댓글을 남긴 사용자 nickname',
  })
  name: string;

  @ApiProperty({
    description: '댓글을 남긴 사용자 직업 종류',
    nullable: true,
    default: null,
  })
  jobType: string | null;

  @ApiProperty({ description: '댓글 내용' })
  content: string;
}

export class UpdateCommentResDto {
  @ApiProperty({ description: '댓글 고유 ID' })
  id: string;

  @ApiProperty({ description: '댓글 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '댓글 수정일' })
  updatedAt: Date;

  @ApiProperty({
    description: '댓글을 작성한 사용자 ID',
  })
  userId: string;

  @ApiProperty({
    description: '댓글을 남긴 사용자 nickname',
  })
  name: string;

  @ApiProperty({
    description: '댓글을 남긴 사용자 직업 종류',
    nullable: true,
    default: null,
  })
  jobType: string | null;

  @ApiProperty({ description: '댓글 내용' })
  content: string;
}
