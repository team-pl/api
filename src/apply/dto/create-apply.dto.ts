import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateApplyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '지원할 프로젝트 ID',
  })
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '프로젝트 지원시 사용할 프로필 ID',
  })
  profileId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자가 입력한 지원 내용',
  })
  details: string;
}
