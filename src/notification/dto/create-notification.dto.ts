import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '알림 대상 사용자 ID',
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '알림 내용',
  })
  message: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '알림 관련 프로젝트 ID',
  })
  projectId?: string;
}
