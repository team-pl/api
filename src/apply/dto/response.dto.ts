import { ApiProperty } from '@nestjs/swagger';
import { EApplyState } from 'src/type/apply.type';

export class PostApplyResDto {
  @ApiProperty({ description: '프로젝트 지원 ID' })
  id: string;

  @ApiProperty({ description: '프로젝트 지원일' })
  createdAt: Date;

  @ApiProperty({ description: '지원 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '지원 삭제일' })
  deletedAt: Date;

  @ApiProperty({
    description: '지원한 프로젝트 ID',
  })
  projectId: string;

  @ApiProperty({
    description: '지원한 사용자 ID',
  })
  userId: string;

  @ApiProperty({
    description: '지원한 프로필 ID',
  })
  profileId: string;

  @ApiProperty({
    description: '지원 상태',
  })
  state: EApplyState;

  @ApiProperty({
    description: '지원 내용',
  })
  details: string;
}
