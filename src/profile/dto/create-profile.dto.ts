import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EEduCategory } from 'src/type/profile.type';

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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '스킬',
    example: 'React/React Native/Figma',
  })
  skill: string;

  // ---------------------------------

  @IsOptional()
  @IsEnum(EEduCategory)
  @ApiPropertyOptional({
    description: '학력1>분류',
    enum: EEduCategory,
    nullable: true,
  })
  eduCategory1: EEduCategory | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력1>학교이름',
    nullable: true,
  })
  eduSchoolName1: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력1>전공',
    nullable: true,
  })
  eduMajor1: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력1>입학일자',
    example: '2024/01',
    nullable: true,
  })
  eduAdmissionDate1: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력1>졸업일자',
    example: '2024/01',
    nullable: true,
  })
  eduGraduationDate1: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '학력1>재학중 여부',
    nullable: true,
  })
  eduIsAttending1: boolean | null;

  // ---------------------------------

  @IsOptional()
  @IsEnum(EEduCategory)
  @ApiPropertyOptional({
    description: '학력2>분류',
    enum: EEduCategory,
    nullable: true,
  })
  eduCategory2: EEduCategory | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력2>학교이름',
    nullable: true,
  })
  eduSchoolName2: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력2>전공',
    nullable: true,
  })
  eduMajor2: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력2>입학일자',
    example: '2024/01',
    nullable: true,
  })
  eduAdmissionDate2: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력2>졸업일자',
    example: '2024/01',
    nullable: true,
  })
  eduGraduationDate2: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '학력2>재학중 여부',
    nullable: true,
  })
  eduIsAttending2: boolean | null;

  // ---------------------------------

  @IsOptional()
  @IsEnum(EEduCategory)
  @ApiPropertyOptional({
    description: '학력3>분류',
    enum: EEduCategory,
    nullable: true,
  })
  eduCategory3: EEduCategory | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력3>학교이름',
    nullable: true,
  })
  eduSchoolName3: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력3>전공',
    nullable: true,
  })
  eduMajor3: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력3>입학일자',
    example: '2024/01',
    nullable: true,
  })
  eduAdmissionDate3: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력3>졸업일자',
    example: '2024/01',
    nullable: true,
  })
  eduGraduationDate3: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '학력3>재학중 여부',
    nullable: true,
  })
  eduIsAttending3: boolean | null;

  // ---------------------------------

  @IsOptional()
  @IsEnum(EEduCategory)
  @ApiPropertyOptional({
    description: '학력4>분류',
    enum: EEduCategory,
    nullable: true,
  })
  eduCategory4: EEduCategory | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력4>학교이름',
    nullable: true,
  })
  eduSchoolName4: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력4>전공',
    nullable: true,
  })
  eduMajor4: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력4>입학일자',
    example: '2024/01',
    nullable: true,
  })
  eduAdmissionDate4: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력4>졸업일자',
    example: '2024/01',
    nullable: true,
  })
  eduGraduationDate4: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '학력4>재학중 여부',
    nullable: true,
  })
  eduIsAttending4: boolean | null;

  // ---------------------------------

  @IsOptional()
  @IsEnum(EEduCategory)
  @ApiPropertyOptional({
    description: '학력5>분류',
    enum: EEduCategory,
    nullable: true,
  })
  eduCategory5: EEduCategory | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력5>학교이름',
    nullable: true,
  })
  eduSchoolName5: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력5>전공',
    nullable: true,
  })
  eduMajor5: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력5>입학일자',
    example: '2024/01',
    nullable: true,
  })
  eduAdmissionDate5: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '학력5>졸업일자',
    example: '2024/01',
    nullable: true,
  })
  eduGraduationDate5: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '학력5>재학중 여부',
    nullable: true,
  })
  eduIsAttending5: boolean | null;

  // -----------------------------

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력1>회사이름',
    nullable: true,
  })
  careerCompanyName1: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력1>역할',
    nullable: true,
  })
  careerRole1: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력1>입사일자',
    example: '2024/01',
    nullable: true,
  })
  careerJoinDate1: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력1>퇴사일자',
    example: '2024/01',
    nullable: true,
  })
  careerQuitDate1: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '경력1>재직중 여부',
    example: '2024/01',
    nullable: true,
  })
  careerIsWorking1: boolean | null;

  // -----------------------------

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력2>회사이름',
    nullable: true,
  })
  careerCompanyName2: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력2>역할',
    nullable: true,
  })
  careerRole2: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력1>입사일자',
    example: '2024/01',
    nullable: true,
  })
  careerJoinDate2: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력2>퇴사일자',
    example: '2024/01',
    nullable: true,
  })
  careerQuitDate2: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '경력2>재직중 여부',
    example: '2024/01',
    nullable: true,
  })
  careerIsWorking2: boolean | null;

  // -----------------------------

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력3>회사이름',
    nullable: true,
  })
  careerCompanyName3: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력3>역할',
    nullable: true,
  })
  careerRole3: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력3>입사일자',
    example: '2024/01',
    nullable: true,
  })
  careerJoinDate3: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력3>퇴사일자',
    example: '2024/01',
    nullable: true,
  })
  careerQuitDate3: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '경력3>재직중 여부',
    example: '2024/01',
    nullable: true,
  })
  careerIsWorking3: boolean | null;

  // -----------------------------

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력4>회사이름',
    nullable: true,
  })
  careerCompanyName4: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력4>역할',
    nullable: true,
  })
  careerRole4: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력4>입사일자',
    example: '2024/01',
    nullable: true,
  })
  careerJoinDate4: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력4>퇴사일자',
    example: '2024/01',
    nullable: true,
  })
  careerQuitDate4: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '경력4>재직중 여부',
    example: '2024/01',
    nullable: true,
  })
  careerIsWorking4: boolean | null;

  // -----------------------------

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력5>회사이름',
    nullable: true,
  })
  careerCompanyName5: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력5>역할',
    nullable: true,
  })
  careerRole5: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력5>입사일자',
    example: '2024/01',
    nullable: true,
  })
  careerJoinDate5: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력5>퇴사일자',
    example: '2024/01',
    nullable: true,
  })
  careerQuitDate5: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '경력5>재직중 여부',
    example: '2024/01',
    nullable: true,
  })
  careerIsWorking5: boolean | null;

  // -----------------------------

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력6>회사이름',
    nullable: true,
  })
  careerCompanyName6: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력6>역할',
    nullable: true,
  })
  careerRole6: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력6>입사일자',
    example: '2024/01',
    nullable: true,
  })
  careerJoinDate6: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력6>퇴사일자',
    example: '2024/01',
    nullable: true,
  })
  careerQuitDate6: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '경력6>재직중 여부',
    example: '2024/01',
    nullable: true,
  })
  careerIsWorking6: boolean | null;

  // -----------------------------

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력7>회사이름',
    nullable: true,
  })
  careerCompanyName7: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력7>역할',
    nullable: true,
  })
  careerRole7: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력7>입사일자',
    example: '2024/01',
    nullable: true,
  })
  careerJoinDate7: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력7>퇴사일자',
    example: '2024/01',
    nullable: true,
  })
  careerQuitDate7: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '경력7>재직중 여부',
    example: '2024/01',
    nullable: true,
  })
  careerIsWorking7: boolean | null;

  // -----------------------------

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력8>회사이름',
    nullable: true,
  })
  careerCompanyName8: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력8>역할',
    nullable: true,
  })
  careerRole8: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력8>입사일자',
    example: '2024/01',
    nullable: true,
  })
  careerJoinDate8: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력8>퇴사일자',
    example: '2024/01',
    nullable: true,
  })
  careerQuitDate8: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '경력8>재직중 여부',
    example: '2024/01',
    nullable: true,
  })
  careerIsWorking8: boolean | null;

  // -----------------------------

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력9>회사이름',
    nullable: true,
  })
  careerCompanyName9: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력9>역할',
    nullable: true,
  })
  careerRole9: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력9>입사일자',
    example: '2024/01',
    nullable: true,
  })
  careerJoinDat9: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력9>퇴사일자',
    example: '2024/01',
    nullable: true,
  })
  careerQuitDate9: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '경력9>재직중 여부',
    example: '2024/01',
    nullable: true,
  })
  careerIsWorking9: boolean | null;

  // -----------------------------

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력10>회사이름',
    nullable: true,
  })
  careerCompanyName10: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력10>역할',
    nullable: true,
  })
  careerRole10: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력10>입사일자',
    example: '2024/01',
    nullable: true,
  })
  careerJoinDat10: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '경력10>퇴사일자',
    example: '2024/01',
    nullable: true,
  })
  careerQuitDat10: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: '경력10>재직중 여부',
    example: '2024/01',
    nullable: true,
  })
  careerIsWorking10: boolean | null;

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
