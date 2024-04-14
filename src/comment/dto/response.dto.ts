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
  nickname: string;

  @ApiProperty({
    description: '댓글을 남긴 사용자 직업 종류',
    nullable: true,
    default: null,
  })
  jobType: string | null;

  @ApiProperty({ description: '댓글 내용' })
  content: string;

  @ApiProperty({ description: ' 댓글 수정 여부' })
  isUpdate: boolean;

  @ApiProperty({ description: ' 댓글 삭제 여부' })
  isDelete: boolean;

  @ApiProperty({ description: '부모 댓글 ID' })
  parentCommentId: string;

  @ApiProperty({ description: '대댓글 등록시 태그한 사용자 ID' })
  referenceUserId: string;

  @ApiProperty({ description: '대댓글 등록시 태그한 사용자 이름' })
  referenceName: string;
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
  nickname: string;

  @ApiProperty({
    description: '댓글을 남긴 사용자 직업 종류',
    nullable: true,
    default: null,
  })
  jobType: string | null;

  @ApiProperty({ description: '댓글 내용' })
  content: string;

  @ApiProperty({ description: ' 댓글 수정 여부' })
  isUpdate: boolean;

  @ApiProperty({ description: ' 댓글 삭제 여부' })
  isDelete: boolean;

  @ApiProperty({ description: '부모 댓글 ID' })
  parentCommentId: string;

  @ApiProperty({ description: '대댓글 등록시 태그한 사용자 ID' })
  referenceUserId: string;

  @ApiProperty({ description: '대댓글 등록시 태그한 사용자 이름' })
  referenceName: string;
}

export class DeleteCommentResDto {
  @ApiProperty({ description: '댓글 삭제 결과' })
  result: boolean;
}

export class GetCommentResDto {
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

export class GetCommentsResDto {
  @ApiProperty({ description: '댓글 목록', isArray: true })
  list: GetCommentResDto;
}
