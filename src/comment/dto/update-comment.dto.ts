import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '댓글을 남긴 프로젝트 ID',
  })
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '댓글 내용',
  })
  content: string;
}
