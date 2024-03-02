import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EEduCategory } from 'src/type/profile.type';

export class EduUpdateDto {
  @ApiProperty({
    description: '학력>분류',
    nullable: true,
    enum: EEduCategory,
  })
  category: EEduCategory | null;

  @ApiProperty({ description: '학력>학교이름', nullable: true })
  schoolName: string | null;

  @ApiProperty({ description: '학력>전공', nullable: true })
  major: string | null;

  @ApiProperty({ description: '학력>입학일자', nullable: true })
  admissionDate: string | null;

  @ApiProperty({ description: '학력>졸업일자', nullable: true })
  graduationDate: string | null;
}

export class CareerUpdateDto {
  @ApiProperty({ description: '경력>회사이름', nullable: true })
  companyName: string | null;

  @ApiProperty({ description: '경력>역할', nullable: true })
  role: string | null;

  @ApiProperty({ description: '경력>입사일자', nullable: true })
  joinDate: string | null;

  @ApiProperty({ description: '경력>퇴사일자', nullable: true })
  quitDate: string | null;
}

export class UpdateProfileDto {
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

  // -----------------------------

  @IsOptional()
  @ApiPropertyOptional({
    description: '학력 정보',
    type: [EduUpdateDto],
    nullable: true,
  })
  edu: EduUpdateDto[] | null;

  @IsOptional()
  @ApiPropertyOptional({
    description: '경력 정보',
    type: [CareerUpdateDto],
    nullable: true,
  })
  career: CareerUpdateDto[] | null;

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
