import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { ESignUp } from 'src/type/user.type';
import { Project } from './project.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn({ name: 'id', comment: 'id' })
  id: string;

  @ApiProperty({ description: '가입일' })
  @CreateDateColumn({ comment: '가입일' })
  createdAt: Date;

  @ApiProperty({ description: '사용자 정보 수정일' })
  @UpdateDateColumn({ comment: '사용자 정보 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '사용자 계정 삭제일' })
  @DeleteDateColumn({ comment: '사용자 계정 삭제일' })
  deletedAt: Date;

  @ApiProperty({ description: '이름' })
  @Column({ comment: '이름' })
  name: string;

  @ApiProperty({ description: '닉네임(별명)', nullable: true, default: null })
  @Column({ comment: '닉네임(별명)', nullable: true, default: null })
  nickname: string | null;

  @ApiProperty({ description: '휴대폰 번호' })
  @Column({ comment: '휴대폰 번호' })
  phone: string;

  @ApiProperty({ description: '이메일' })
  @Column({ comment: '이메일' })
  email: string;

  @ApiProperty({
    nullable: true,
    description:
      '카카오 ID(카카오에서 제공해주며, 카카오 소셜 로그인으로 가입한 사용자는 고유 ID를 가짐)',
    default: null,
  })
  @Column({
    nullable: true,
    comment:
      '카카오 ID(카카오에서 제공해주며, 카카오 소셜 로그인으로 가입한 사용자는 고유 ID를 가짐)',
    default: null,
  })
  kakaoId: string | null;

  @ApiProperty({
    nullable: true,
    description:
      '네이버 ID(네이버에서 제공해주며, 네이버 소셜 로그인으로 가입한 사용자는 고유 ID를 가짐)',
    default: null,
  })
  @Column({
    nullable: true,
    comment:
      '네이버 ID(네이버에서 제공해주며, 네이버 소셜 로그인으로 가입한 사용자는 고유 ID를 가짐)',
    default: null,
  })
  naverId: string | null;

  @ApiProperty({
    description: 'Refresh Token',
    nullable: true,
    default: null,
  })
  @Column({ comment: 'Refresh Token', default: null, nullable: true })
  refreshToken: string | null;

  @ApiProperty({
    description: '프로필사진 url',
    nullable: true,
    default: null,
  })
  @Column({ comment: '프로필사진 url', default: null, nullable: true })
  profileImageUrl: string | null;

  @ApiProperty({
    description: '대표 프로필 ID',
    nullable: true,
    default: null,
  })
  @Column({ comment: '대표 프로필 ID', default: null, nullable: true })
  representativeProfileId: string | null;

  @ApiProperty({
    description: '회원가입 종류(네이버/카카오)',
    default: ESignUp.KAKAO,
  })
  @Column({ comment: '회원가입 종류(네이버/카카오)', default: ESignUp.KAKAO })
  signUpType: ESignUp;

  @ApiProperty({
    description: '직업 종류',
    nullable: true,
    default: null,
  })
  @Column({
    comment: '직업 종류',
    nullable: true,
    default: null,
  })
  jobType: string | null;

  @ApiProperty({
    description: '찜한 공고수',
    default: 0,
  })
  @Column({ comment: '찜한 공고수', default: 0 })
  numberOfLikes: number;

  @ApiProperty({
    description: '등록한 공고수',
    default: 0,
  })
  @Column({ comment: '등록한 공고수', default: 0 })
  numberOfRegistrations: number;

  @ApiProperty({
    description: '지원한 공고수',
    default: 0,
  })
  @Column({ comment: '지원한 공고수', default: 0 })
  numberOfApplications: number;

  @ApiProperty({
    description: '참여확정수',
    default: 0,
  })
  @Column({ comment: '참여확정수', default: 0 })
  numberOfConfirmed: number;

  @ApiProperty({ description: '사용자의 프로필 정보' })
  @OneToMany(() => Profile, (profile) => profile.user)
  profile: Profile[];

  @ApiProperty({ description: '사용자가 등록한 프로젝트' })
  @OneToMany(() => Project, (project) => project.user)
  project: Project[];
}
