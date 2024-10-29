import { ApiProperty } from '@nestjs/swagger';
import { EEduCategory } from 'src/type/profile.type';
import { ESignUp } from 'src/type/user.type';

export class EduResDto {
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

  @ApiProperty({ description: '학력>재학중 여부', nullable: true })
  isAttending: boolean | null;
}

export class CareerResDto {
  @ApiProperty({ description: '경력>회사이름', nullable: true })
  companyName: string | null;

  @ApiProperty({ description: '경력>역할', nullable: true })
  role: string | null;

  @ApiProperty({ description: '경력>입사일자', nullable: true })
  joinDate: string | null;

  @ApiProperty({ description: '경력>퇴사일자', nullable: true })
  quitDate: string | null;

  @ApiProperty({ description: '경력>재직중 여부', nullable: true })
  isWorking: boolean | null;
}

export class PostProfileResDto {
  @ApiProperty({ description: '프로필 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로필 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로필을 등록한 사용자 ID' })
  userId: string;

  @ApiProperty({ description: '프로필 제목' })
  name: string;

  @ApiProperty({ description: '대표 프로필 여부' })
  isRepresentative: boolean;

  @ApiProperty({
    description: '학력 정보',
    isArray: true,
  })
  edu: EduResDto;

  @ApiProperty({
    description: '경력 정보',
    isArray: true,
  })
  carrer: CareerResDto;

  @ApiProperty({
    description: '스킬',
    type: [String],
  })
  skill: string[];

  @ApiProperty({
    description: '포트폴리오 url',
    nullable: true,
    default: null,
  })
  portfolioUrl: string | null;

  @ApiProperty({
    description: '포트폴리오 파일',
    nullable: true,
    default: null,
  })
  portfolioFile: string | null;

  @ApiProperty({
    description: '임시저장 여부',
  })
  isTemporaryStorage: boolean;
}

export class UpdateProfileResDto {
  @ApiProperty({ description: '프로필 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로필 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로필을 등록한 사용자 ID' })
  userId: string;

  @ApiProperty({ description: '프로필 제목' })
  name: string;

  @ApiProperty({ description: '대표 프로필 여부' })
  isRepresentative: boolean;

  @ApiProperty({
    description: '학력 정보',
    isArray: true,
  })
  edu: EduResDto;

  @ApiProperty({
    description: '경력 정보',
    isArray: true,
  })
  carrer: CareerResDto;

  @ApiProperty({
    description: '스킬',
    type: [String],
  })
  skill: string[];

  @ApiProperty({
    description: '포트폴리오 url',
    nullable: true,
    default: null,
  })
  portfolioUrl: string | null;

  @ApiProperty({
    description: '포트폴리오 파일',
    nullable: true,
    default: null,
  })
  portfolioFile: string | null;

  @ApiProperty({
    description: '임시저장 여부',
  })
  isTemporaryStorage: boolean;
}

export class DeleteProfileResDto {
  @ApiProperty({
    description: '프로필 삭제 결과',
  })
  result: boolean;
}

export class GetMyInfoProfileResDto {
  @ApiProperty({ description: '프로필 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로필 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로필 제목' })
  name: string;

  @ApiProperty({ description: '대표 프로필 여부' })
  isRepresentative: boolean;

  @ApiProperty({
    description: '학력 정보',
    isArray: true,
  })
  edu: EduResDto;

  @ApiProperty({
    description: '경력 정보',
    isArray: true,
  })
  carrer: CareerResDto;

  @ApiProperty({
    description: '스킬',
    type: [String],
  })
  skill: string[];

  @ApiProperty({
    description: '포트폴리오 url',
    nullable: true,
    default: null,
  })
  portfolioUrl: string | null;

  @ApiProperty({
    description: '포트폴리오 파일',
    nullable: true,
    default: null,
  })
  portfolioFile: string | null;

  @ApiProperty({
    description: '임시저장 여부',
  })
  isTemporaryStorage: boolean;
}

export class GetMyInfoResDto {
  @ApiProperty({ description: '사용자ID' })
  id: string;

  @ApiProperty({
    description: '프로필사진 url',
  })
  profileImageUrl: string;

  @ApiProperty({ description: '닉네임(별명)' })
  nickname: string;

  @ApiProperty({
    description: '회원가입 종류(네이버/카카오)',
    enum: ESignUp,
  })
  signUpType: ESignUp;

  @ApiProperty({
    description: '직업 종류',
    nullable: true,
  })
  jobType: string | null;

  @ApiProperty({
    description: '대표 프로필 ID',
    nullable: true,
  })
  representativeProfileId: string | null;

  @ApiProperty({
    description: '프로필 정보',
    type: [GetMyInfoProfileResDto],
  })
  profile: GetMyInfoProfileResDto[];
}

export class PostTempProfileResDto {
  @ApiProperty({ description: '프로필 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로필 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로필을 등록한 사용자 ID' })
  userId: string;

  @ApiProperty({ description: '프로필 제목' })
  name: string;

  @ApiProperty({ description: '대표 프로필 여부' })
  isRepresentative: boolean;

  @ApiProperty({
    description: '학력 정보',
    isArray: true,
  })
  edu: EduResDto;

  @ApiProperty({
    description: '경력 정보',
    isArray: true,
  })
  carrer: CareerResDto;

  @ApiProperty({
    description: '스킬',
    type: [String],
  })
  skill: string[];

  @ApiProperty({
    description: '포트폴리오 url',
    nullable: true,
    default: null,
  })
  portfolioUrl: string | null;

  @ApiProperty({
    description: '포트폴리오 파일',
    nullable: true,
    default: null,
  })
  portfolioFile: string | null;

  @ApiProperty({
    description: '임시저장 여부',
  })
  isTemporaryStorage: boolean;
}

// NOTE: 지원시 조회하는 프로필 데이터 DTO
export class GetApplyProfileResDto {
  @ApiProperty({ description: '프로필 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로필 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로필 제목' })
  name: string;

  @ApiProperty({
    description: '학력 정보',
    isArray: true,
  })
  edu: EduResDto;

  @ApiProperty({
    description: '경력 정보',
    isArray: true,
  })
  carrer: CareerResDto;

  @ApiProperty({
    description: '스킬',
    type: [String],
  })
  skill: string[];

  @ApiProperty({
    description: '포트폴리오 url',
    nullable: true,
    default: null,
  })
  portfolioUrl: string | null;

  @ApiProperty({
    description: '포트폴리오 파일',
    nullable: true,
    default: null,
  })
  portfolioFile: string | null;
}

export class GetProfileResDto {
  @ApiProperty({ description: '프로필 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로필 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로필 제목' })
  name: string;

  @ApiProperty({ description: '대표 프로필 여부' })
  isRepresentative: boolean;

  @ApiProperty({
    description: '임시저장 여부',
  })
  isTemporaryStorage: boolean;
}

export class GetProfileListResDto {
  @ApiProperty({
    description: '프로필 데이터 형식',
    type: GetProfileResDto,
    isArray: true,
  })
  list: GetProfileResDto[];
}

export class GetOneProfileResDto {
  @ApiProperty({ description: '프로필 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로필 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로필 제목' })
  name: string;

  @ApiProperty({ description: '대표 프로필 여부' })
  isRepresentative: boolean;

  @ApiProperty({
    description: '학력 정보',
    isArray: true,
  })
  edu: EduResDto;

  @ApiProperty({
    description: '경력 정보',
    isArray: true,
  })
  carrer: CareerResDto;

  @ApiProperty({
    description: '스킬',
    type: [String],
  })
  skill: string[];

  @ApiProperty({
    description: '포트폴리오 url',
    nullable: true,
    default: null,
  })
  portfolioUrl: string | null;

  @ApiProperty({
    description: '포트폴리오 파일',
    nullable: true,
    default: null,
  })
  portfolioFile: string | null;

  @ApiProperty({
    description: '임시저장 여부',
  })
  isTemporaryStorage: boolean;
}

export class GetProfileExistsResDto {
  @ApiProperty({
    description: '프로필 등록 여부 결과',
  })
  result: boolean;
}

export class GetProfileForProjectResDto {
  @ApiProperty({ description: '프로필 제목' })
  name: string;

  @ApiProperty({
    description: '학력 정보',
    isArray: true,
  })
  edu: EduResDto;

  @ApiProperty({
    description: '경력 정보',
    isArray: true,
  })
  carrer: CareerResDto;

  @ApiProperty({
    description: '스킬',
    type: [String],
  })
  skill: string[];

  @ApiProperty({
    description: '포트폴리오 url',
    nullable: true,
    default: null,
  })
  portfolioUrl: string | null;

  @ApiProperty({
    description: '포트폴리오 파일',
    nullable: true,
    default: null,
  })
  portfolioFile: string | null;
}
