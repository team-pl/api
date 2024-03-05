import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ECategory1, ECategory2 } from 'src/type/project.type';

export class CategoryUpdateDto {
  @IsOptional()
  @IsEnum(ECategory1)
  @ApiProperty({
    description: '프로젝트 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category: ECategory1 | null;

  @IsOptional()
  @IsEnum(ECategory2)
  @ApiProperty({
    description: '프로젝트 카테고리2',
    enum: ECategory2,
    nullable: true,
  })
  subCategory: ECategory2 | null;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: '프로젝트 카테고리1의 모집인원',
    nullable: true,
  })
  count: number | null;
}

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '프로젝트 이름',
    example: '팀+ 프로젝트 모집',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '프로젝트 모집마감일',
    example: '2024/08/01',
  })
  recruitExpiredAt: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '프로젝트 모집내용',
    example: '팀+ 프로젝트를 모집합니다. 관심있으시면 참여 부탁드립니다!',
  })
  content: string;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: '프로젝트 관련 참고 url',
    example: 'https://teampl-plus.com',
  })
  url: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: '프로젝트 관련 참고 파일',
  })
  file: Express.Multer.File;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '프로젝트 총 모집인원',
  })
  recruitTotalNumber: number;

  @IsString()
  @ApiProperty({
    description: '프로젝트 모집자가 선택한 프로필 ID',
  })
  profileId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '카테고리 정보',
    type: [CategoryUpdateDto],
  })
  categoryInfo: CategoryUpdateDto[];
}
