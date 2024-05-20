import { ApiProperty } from '@nestjs/swagger';

export class ClickLikeDto {
  @ApiProperty({
    description: '프로젝트 ID',
  })
  projectId: string;
}
