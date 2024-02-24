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

  @IsEnum(ECategory1)
  @IsNotEmpty()
  @ApiProperty({
    description: '프로젝트 카테고리1의 카테고리1',
    enum: ECategory1,
    default: ECategory1.DEVELOPER,
  })
  category1_1: ECategory1;

  @IsEnum(ECategory2)
  @IsNotEmpty()
  @ApiProperty({
    description: '프로젝트 카테고리1의 카테고리2',
    enum: ECategory2,
    default: ECategory2.DEV_BE,
  })
  category1_2: ECategory2;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '프로젝트 카테고리1의 모집인원',
  })
  category1Number: number;

  @IsOptional()
  @IsEnum(ECategory1)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리2의 카테고리1',
    enum: ECategory1,
    nullable: true,
  })
  category2_1: ECategory1 | null;

  @IsOptional()
  @IsEnum(ECategory2)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리2의 카테고리2',
    enum: ECategory2,
    nullable: true,
  })
  category2_2: ECategory2 | null;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '프로젝트 카테고리2의 모집인원',
    nullable: true,
  })
  category2Number: number | null;

  @IsOptional()
  @IsEnum(ECategory1)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리3의 카테고리1',
    enum: ECategory1,
    nullable: true,
  })
  category3_1: ECategory1 | null;

  @IsOptional()
  @IsEnum(ECategory2)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리3의 카테고리2',
    enum: ECategory2,
    nullable: true,
  })
  category3_2: ECategory2 | null;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '프로젝트 카테고리3의 모집인원',
    nullable: true,
  })
  category3Number: number | null;

  @IsOptional()
  @IsEnum(ECategory1)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리4의 카테고리1',
    enum: ECategory1,
    nullable: true,
  })
  category4_1: ECategory1 | null;

  @IsOptional()
  @IsEnum(ECategory2)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리4의 카테고리2',
    enum: ECategory2,
    nullable: true,
  })
  category4_2: ECategory2 | null;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '프로젝트 카테고리4의 모집인원',
    nullable: true,
  })
  category4Number: number | null;

  @IsOptional()
  @IsEnum(ECategory1)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리5의 카테고리1',
    enum: ECategory1,
    nullable: true,
  })
  category5_1: ECategory1 | null;

  @IsOptional()
  @IsEnum(ECategory2)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리5의 카테고리2',
    enum: ECategory2,
    nullable: true,
  })
  category5_2: ECategory2 | null;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '프로젝트 카테고리5의 모집인원',
    nullable: true,
  })
  category5Number: number | null;

  @IsOptional()
  @IsEnum(ECategory1)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리6의 카테고리1',
    enum: ECategory1,
    nullable: true,
  })
  category6_1: ECategory1 | null;

  @IsOptional()
  @IsEnum(ECategory2)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리6의 카테고리2',
    enum: ECategory2,
    nullable: true,
  })
  category6_2: ECategory2 | null;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '프로젝트 카테고리6의 모집인원',
    nullable: true,
  })
  category6Number: number | null;

  @IsOptional()
  @IsEnum(ECategory1)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리7의 카테고리1',
    enum: ECategory1,
    nullable: true,
  })
  category7_1: ECategory1 | null;

  @IsOptional()
  @IsEnum(ECategory2)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리7의 카테고리2',
    enum: ECategory2,
    nullable: true,
  })
  category7_2: ECategory2 | null;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '프로젝트 카테고리7의 모집인원',
    nullable: true,
  })
  category7Number: number | null;

  @IsOptional()
  @IsEnum(ECategory1)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리8의 카테고리1',
    enum: ECategory1,
    nullable: true,
  })
  category8_1: ECategory1 | null;

  @IsOptional()
  @IsEnum(ECategory2)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리8의 카테고리2',
    enum: ECategory2,
    nullable: true,
  })
  category8_2: ECategory2 | null;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '프로젝트 카테고리8의 모집인원',
    nullable: true,
  })
  category8Number: number | null;

  @IsOptional()
  @IsEnum(ECategory1)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리9의 카테고리1',
    enum: ECategory1,
    nullable: true,
  })
  category9_1: ECategory1 | null;

  @IsOptional()
  @IsEnum(ECategory2)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리9의 카테고리2',
    enum: ECategory2,
    nullable: true,
  })
  category9_2: ECategory2 | null;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '프로젝트 카테고리9의 모집인원',
    nullable: true,
  })
  category9Number: number | null;

  @IsOptional()
  @IsEnum(ECategory1)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리10의 카테고리1',
    enum: ECategory1,
    nullable: true,
  })
  category10_1: ECategory1 | null;

  @IsOptional()
  @IsEnum(ECategory2)
  @ApiPropertyOptional({
    description: '프로젝트 카테고리10의 카테고리2',
    enum: ECategory2,
    nullable: true,
  })
  category10_2: ECategory2 | null;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '프로젝트 카테고리10의 모집인원',
    nullable: true,
  })
  category10Number: number | null;
}
