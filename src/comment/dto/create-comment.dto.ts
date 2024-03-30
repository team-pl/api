import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
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

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '대댓글 남길때>댓글 ID(부모 댓글 ID)',
    nullable: true,
  })
  parentCommentId: string | null;
}
