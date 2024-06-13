import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetDashboardProjectsQueryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '현재까지 조회한 프로젝트 개수',
  })
  skip: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '조회하려는 프로젝트 개수',
  })
  take?: string;
}
