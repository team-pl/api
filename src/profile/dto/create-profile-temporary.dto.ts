import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EEduCategory } from 'src/type/profile.type';

export class EduTempPostDto {
  @IsOptional()
  @IsEnum(EEduCategory)
  @ApiProperty({
    description: '학력>분류',
    nullable: true,
    enum: EEduCategory,
  })
  category: EEduCategory | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '학력>학교이름', nullable: true })
  schoolName: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '학력>전공', nullable: true })
  major: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '학력>입학일자(YYYY/MM)',
    example: '2024/10',
    nullable: true,
  })
  admissionDate: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '학력>졸업일자(YYYY/MM)',
    example: '2024/10',
    nullable: true,
  })
  graduationDate: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: '학력>재학중 여부', nullable: true })
  isAttending: boolean | null;
}

export class CareerTempPostDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '경력>회사이름', nullable: true })
  companyName: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '경력>역할', nullable: true })
  role: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '경력>입사일자(YYYY/MM)',
    example: '2024/10',
    nullable: true,
  })
  joinDate: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '경력>퇴사일자(YYYY/MM)',
    example: '2024/10',
    nullable: true,
  })
  quitDate: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: '경력>재직중 여부', nullable: true })
  isWorking: boolean | null;
}

export class CreateProfileTempDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      '이전에 임시저장된 프로필 ID(처음 임시 저장할 때는 없어도 되지만, 임시저장을 여러 번 하는 경우 필요)',
  })
  id: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '프로필 제목',
    example: '김이박 프로필1',
  })
  name: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '대표 프로필 여부',
  })
  isRepresentative: boolean | null;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    description: '스킬',
    type: () => String,
    isArray: true,
  })
  skill: string[] | null;

  // ---------------------------------

  @IsOptional()
  @ApiPropertyOptional({
    description: '학력 정보(최대 5개까지 등록가능)',
    type: [EduTempPostDto],
    nullable: true,
  })
  edu: EduTempPostDto[] | null;

  @IsOptional()
  @ApiPropertyOptional({
    description: '경력 정보(최대 10개까지 등록가능)',
    type: [CareerTempPostDto],
    nullable: true,
  })
  career: CareerTempPostDto[] | null;

  // -----------------------------

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    description: '포트폴리오 url',
    example: 'https://teampl-plus.com',
    nullable: true,
    default: null,
  })
  portfolioUrl: string | null;

  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: '포트폴리오 파일',
    nullable: true,
    default: null,
  })
  portfolioFile: Express.Multer.File;
}
