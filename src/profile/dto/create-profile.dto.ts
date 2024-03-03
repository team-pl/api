import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EEduCategory } from 'src/type/profile.type';

export class EduPostDto {
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
  @ApiProperty({ description: '학력>입학일자', nullable: true })
  admissionDate: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '학력>졸업일자', nullable: true })
  graduationDate: string | null;
}

export class CareerPostDto {
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
  @ApiProperty({ description: '경력>입사일자', nullable: true })
  joinDate: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '경력>퇴사일자', nullable: true })
  quitDate: string | null;
}

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '프로필 제목',
    example: '김이박 프로필1',
  })
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: '대표 프로필 여부',
  })
  isRepresentative: boolean;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: '스킬',
    type: [String],
  })
  skill: string[];

  // ---------------------------------

  @IsOptional()
  @ApiPropertyOptional({
    description: '학력 정보',
    type: [EduPostDto],
    nullable: true,
  })
  edu: EduPostDto[] | null;

  @IsOptional()
  @ApiPropertyOptional({
    description: '경력 정보',
    type: [CareerPostDto],
    nullable: true,
  })
  career: CareerPostDto[] | null;

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

  @IsOptional()
  @ApiPropertyOptional({
    description: '임시저장된 프로필 ID(임시 저장 후 등록할때 추가)',
    nullable: true,
  })
  tempProfileId: string | null;
}
