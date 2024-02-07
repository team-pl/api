import { ApiProperty } from '@nestjs/swagger';
import { ESignUp } from 'src/type/user.type';

export class GetUserResDto {
  @ApiProperty({ description: '사용자ID' })
  id: string;

  @ApiProperty({ description: '가입일', type: Date })
  createdAt: Date;

  @ApiProperty({ description: '사용자 정보 수정일', type: Date })
  updatedAt: Date;

  @ApiProperty({ description: '사용자 계정 삭제일', type: Date || null })
  deletedAt: Date | null;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '닉네임(별명)', nullable: true })
  nickname: string | null;

  @ApiProperty({ description: '휴대폰 번호' })
  phone: string;

  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({
    description: 'Refresh Token',
    nullable: true,
  })
  refreshToken: string | null;

  @ApiProperty({
    description: '프로필사진 url',
    nullable: true,
  })
  profileImageUrl: string | null;

  @ApiProperty({
    description: '대표 프로필 ID',
    nullable: true,
  })
  representativeProfileId: string | null;

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
    description: '찜한 공고수',
  })
  numberOfLikes: number;

  @ApiProperty({
    description: '등록한 공고수',
  })
  numberOfRegistrations: number;

  @ApiProperty({
    description: '지원한 공고수',
  })
  numberOfApplications: number;

  @ApiProperty({
    description: '참여확정수',
  })
  numberOfConfirmed: number;
}

export class PostUserResDto {
  @ApiProperty({ description: '사용자ID' })
  id: string;

  @ApiProperty({ description: '가입일', type: Date })
  createdAt: Date;

  @ApiProperty({ description: '사용자 정보 수정일', type: Date })
  updatedAt: Date;

  @ApiProperty({ description: '사용자 계정 삭제일', type: Date || null })
  deletedAt: Date | null;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '닉네임(별명)' })
  nickname: string;

  @ApiProperty({ description: '휴대폰 번호' })
  phone: string;

  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({
    description: 'Refresh Token',
    nullable: true,
  })
  refreshToken: string | null;

  @ApiProperty({
    description: '프로필사진 url',
    nullable: true,
  })
  profileImageUrl: string | null;

  @ApiProperty({
    description: '대표 프로필 ID',
    nullable: true,
  })
  representativeProfileId: string | null;

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
    description: '찜한 공고수',
  })
  numberOfLikes: number;

  @ApiProperty({
    description: '등록한 공고수',
  })
  numberOfRegistrations: number;

  @ApiProperty({
    description: '지원한 공고수',
  })
  numberOfApplications: number;

  @ApiProperty({
    description: '참여확정수',
  })
  numberOfConfirmed: number;
}

export class NicknameDuplicateResDto {
  @ApiProperty({ description: '닉네임 중복체크 결과' })
  result: boolean;
}
