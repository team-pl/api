import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  ECategorySelect,
  ESortDirection,
  ESubCategorySelect,
} from 'src/type/project.type';

export class GetProjectQueryDto {
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

  @IsOptional()
  @IsEnum(ECategorySelect)
  @ApiPropertyOptional({
    description: '조회 카테고리',
    enum: ECategorySelect,
  })
  category?: ECategorySelect;

  @IsOptional()
  @IsEnum(ESubCategorySelect)
  @ApiPropertyOptional({
    description: '조회 하위 카테고리',
    enum: ESubCategorySelect,
  })
  subCategory?: ESubCategorySelect;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '검색어',
  })
  searchWord?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '사용자 ID',
  })
  userId?: string;

  @IsOptional()
  @IsEnum(ESortDirection)
  @ApiPropertyOptional({
    description: '조회 정렬 선택',
    enum: ESortDirection,
  })
  sort: ESortDirection;
}
