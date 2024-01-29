import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { EEduCategory } from 'src/type/profile.type';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryColumn({ name: 'id', comment: 'id' })
  id: string;

  @ApiProperty({ description: '프로필 등록일' })
  @CreateDateColumn({ comment: '프로필 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로필 수정일' })
  @UpdateDateColumn({ comment: '프로필 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '프로필 삭제일' })
  @DeleteDateColumn({ comment: '프로필 삭제일' })
  deletedAt: Date;

  @ApiProperty({ description: '프로필을 등록한 사용자 ID' })
  @Column({ comment: '프로필을 등록한 사용자 ID' })
  userId: string;

  @ApiProperty({ description: '프로필 제목' })
  @Column({ comment: '프로필 제목' })
  name: string;

  @ApiProperty({ description: '대표 프로필 여부' })
  @Column({ comment: '대표 프로필 여부' })
  isRepresentative: boolean;

  @ApiPropertyOptional({
    description: '학력1>분류',
    nullable: true,
    enum: EEduCategory,
  })
  @Column({ comment: '학력1>분류', nullable: true, enum: EEduCategory })
  eduCategory1: EEduCategory | null;

  @ApiPropertyOptional({ description: '학력1>학교이름', nullable: true })
  @Column({ comment: '학력1>학교이름', nullable: true })
  eduSchoolName1: string | null;

  @ApiPropertyOptional({ description: '학력1>전공', nullable: true })
  @Column({ comment: '학력1>전공', nullable: true })
  eduMajor1: string | null;

  @ApiPropertyOptional({ description: '학력1>입학일자', nullable: true })
  @Column({ comment: '학력1>입학일자', nullable: true })
  eduAdmissionDate1: Date | null;

  @ApiPropertyOptional({ description: '학력1>졸업일자', nullable: true })
  @Column({ comment: '학력1>졸업일자', nullable: true })
  eduGraduationDate1: Date | null;

  @ApiPropertyOptional({ description: '학력1>재학중 여부', nullable: true })
  @Column({ comment: '학력1>재학중 여부', nullable: true })
  eduIsAttending1: boolean | null;

  // -------------------------------

  @ApiPropertyOptional({
    description: '학력2>분류',
    nullable: true,
    enum: EEduCategory,
  })
  @Column({ comment: '학력2>분류', nullable: true, enum: EEduCategory })
  eduCategory2: EEduCategory | null;

  @ApiPropertyOptional({ description: '학력2>학교이름', nullable: true })
  @Column({ comment: '학력2>학교이름', nullable: true })
  eduSchoolName2: string | null;

  @ApiPropertyOptional({ description: '학력2>전공', nullable: true })
  @Column({ comment: '학력2>전공', nullable: true })
  eduMajor2: string | null;

  @ApiPropertyOptional({ description: '학력2>입학일자', nullable: true })
  @Column({ comment: '학력2>입학일자', nullable: true })
  eduAdmissionDate2: Date | null;

  @ApiPropertyOptional({ description: '학력2>졸업일자', nullable: true })
  @Column({ comment: '학력2>졸업일자', nullable: true })
  eduGraduationDate2: Date | null;

  @ApiPropertyOptional({ description: '학력2>재학중 여부', nullable: true })
  @Column({ comment: '학력2>재학중 여부', nullable: true })
  eduIsAttending2: boolean | null;

  // -------------------------------

  @ApiPropertyOptional({
    description: '학력3>분류',
    nullable: true,
    enum: EEduCategory,
  })
  @Column({ comment: '학력3>분류', nullable: true, enum: EEduCategory })
  eduCategory3: EEduCategory | null;

  @ApiPropertyOptional({ description: '학력3>학교이름', nullable: true })
  @Column({ comment: '학력3>학교이름', nullable: true })
  eduSchoolName3: string | null;

  @ApiPropertyOptional({ description: '학력3>전공', nullable: true })
  @Column({ comment: '학력3>전공', nullable: true })
  eduMajor3: string | null;

  @ApiPropertyOptional({ description: '학력3>입학일자', nullable: true })
  @Column({ comment: '학력3>입학일자', nullable: true })
  eduAdmissionDate3: Date | null;

  @ApiPropertyOptional({ description: '학력3>졸업일자', nullable: true })
  @Column({ comment: '학력3>졸업일자', nullable: true })
  eduGraduationDate3: Date | null;

  @ApiPropertyOptional({ description: '학력3>재학중 여부', nullable: true })
  @Column({ comment: '학력3>재학중 여부', nullable: true })
  eduIsAttending3: boolean | null;

  // -------------------------------

  @ApiPropertyOptional({
    description: '학력4>분류',
    nullable: true,
    enum: EEduCategory,
  })
  @Column({ comment: '학력4>분류', nullable: true, enum: EEduCategory })
  eduCategory4: EEduCategory | null;

  @ApiPropertyOptional({ description: '학력4>학교이름', nullable: true })
  @Column({ comment: '학력4>학교이름', nullable: true })
  eduSchoolName4: string | null;

  @ApiPropertyOptional({ description: '학력4>전공', nullable: true })
  @Column({ comment: '학력4>전공', nullable: true })
  eduMajor4: string | null;

  @ApiPropertyOptional({ description: '학력4>입학일자', nullable: true })
  @Column({ comment: '학력4>입학일자', nullable: true })
  eduAdmissionDate4: Date | null;

  @ApiPropertyOptional({ description: '학력4>졸업일자', nullable: true })
  @Column({ comment: '학력4>졸업일자', nullable: true })
  eduGraduationDate4: Date | null;

  @ApiPropertyOptional({ description: '학력4>재학중 여부', nullable: true })
  @Column({ comment: '학력4>재학중 여부', nullable: true })
  eduIsAttending4: boolean | null;

  // -------------------------------

  @ApiPropertyOptional({
    description: '학력5>분류',
    nullable: true,
    enum: EEduCategory,
  })
  @Column({ comment: '학력5>분류', nullable: true, enum: EEduCategory })
  eduCategory5: EEduCategory | null;

  @ApiPropertyOptional({ description: '학력5>학교이름', nullable: true })
  @Column({ comment: '학력5>학교이름', nullable: true })
  eduSchoolName5: string | null;

  @ApiPropertyOptional({ description: '학력5>전공', nullable: true })
  @Column({ comment: '학력5>전공', nullable: true })
  eduMajor5: string | null;

  @ApiPropertyOptional({ description: '학력5>입학일자', nullable: true })
  @Column({ comment: '학력5>입학일자', nullable: true })
  eduAdmissionDate5: Date | null;

  @ApiPropertyOptional({ description: '학력5>졸업일자', nullable: true })
  @Column({ comment: '학력5>졸업일자', nullable: true })
  eduGraduationDate5: Date | null;

  @ApiPropertyOptional({ description: '학력5>재학중 여부', nullable: true })
  @Column({ comment: '학력5>재학중 여부', nullable: true })
  eduIsAttending5: boolean | null;

  // ---------------------------

  @ApiPropertyOptional({ description: '경력1>회사이름', nullable: true })
  @Column({ comment: '경력1>회사이름', nullable: true })
  careerCompanyName1: string | null;

  @ApiPropertyOptional({ description: '경력1>역할', nullable: true })
  @Column({ comment: '경력1>역할', nullable: true })
  careerRole1: string | null;

  @ApiPropertyOptional({ description: '경력1>입사일자', nullable: true })
  @Column({ comment: '경력1>입사일자', nullable: true })
  careerJoinDate1: Date | null;

  @ApiPropertyOptional({ description: '경력1>퇴사일자', nullable: true })
  @Column({ comment: '경력1>퇴사일자', nullable: true })
  careerQuitDate1: Date | null;

  @ApiPropertyOptional({ description: '경력1>재직중 여부', nullable: true })
  @Column({ comment: '경력1>재직중 여부', nullable: true })
  careerIsWorking1: boolean | null;

  // ---------------------------

  @ApiPropertyOptional({ description: '경력2>회사이름', nullable: true })
  @Column({ comment: '경력2>회사이름', nullable: true })
  careerCompanyName2: string | null;

  @ApiPropertyOptional({ description: '경력2>역할', nullable: true })
  @Column({ comment: '경력2>역할', nullable: true })
  careerRole2: string | null;

  @ApiPropertyOptional({ description: '경력2>입사일자', nullable: true })
  @Column({ comment: '경력2>입사일자', nullable: true })
  careerJoinDate2: Date | null;

  @ApiPropertyOptional({ description: '경력2>퇴사일자', nullable: true })
  @Column({ comment: '경력2>퇴사일자', nullable: true })
  careerQuitDate2: Date | null;

  @ApiPropertyOptional({ description: '경력2>재직중 여부', nullable: true })
  @Column({ comment: '경력2>재직중 여부', nullable: true })
  careerIsWorking2: boolean | null;

  // ---------------------------

  @ApiPropertyOptional({ description: '경력3>회사이름', nullable: true })
  @Column({ comment: '경력3>회사이름', nullable: true })
  careerCompanyName3: string | null;

  @ApiPropertyOptional({ description: '경력3>역할', nullable: true })
  @Column({ comment: '경력3>역할', nullable: true })
  careerRole3: string | null;

  @ApiPropertyOptional({ description: '경력3>입사일자', nullable: true })
  @Column({ comment: '경력3>입사일자', nullable: true })
  careerJoinDate3: Date | null;

  @ApiPropertyOptional({ description: '경력3>퇴사일자', nullable: true })
  @Column({ comment: '경력3>퇴사일자', nullable: true })
  careerQuitDate3: Date | null;

  @ApiPropertyOptional({ description: '경력3>재직중 여부', nullable: true })
  @Column({ comment: '경력3>재직중 여부', nullable: true })
  careerIsWorking3: boolean | null;

  // ---------------------------

  @ApiPropertyOptional({ description: '경력4>회사이름', nullable: true })
  @Column({ comment: '경력4>회사이름', nullable: true })
  careerCompanyName4: string | null;

  @ApiPropertyOptional({ description: '경력4>역할', nullable: true })
  @Column({ comment: '경력4>역할', nullable: true })
  careerRole4: string | null;

  @ApiPropertyOptional({ description: '경력4>입사일자', nullable: true })
  @Column({ comment: '경력4>입사일자', nullable: true })
  careerJoinDate4: Date | null;

  @ApiPropertyOptional({ description: '경력4>퇴사일자', nullable: true })
  @Column({ comment: '경력4>퇴사일자', nullable: true })
  careerQuitDate4: Date | null;

  @ApiPropertyOptional({ description: '경력4>재직중 여부', nullable: true })
  @Column({ comment: '경력4>재직중 여부', nullable: true })
  careerIsWorking4: boolean | null;

  // ---------------------------

  @ApiPropertyOptional({ description: '경력5>회사이름', nullable: true })
  @Column({ comment: '경력5>회사이름', nullable: true })
  careerCompanyName5: string | null;

  @ApiPropertyOptional({ description: '경력5>역할', nullable: true })
  @Column({ comment: '경력5>역할', nullable: true })
  careerRole5: string | null;

  @ApiPropertyOptional({ description: '경력5>입사일자', nullable: true })
  @Column({ comment: '경력5>입사일자', nullable: true })
  careerJoinDate5: Date | null;

  @ApiPropertyOptional({ description: '경력5>퇴사일자', nullable: true })
  @Column({ comment: '경력5>퇴사일자', nullable: true })
  careerQuitDate5: Date | null;

  @ApiPropertyOptional({ description: '경력5>재직중 여부', nullable: true })
  @Column({ comment: '경력5>재직중 여부', nullable: true })
  careerIsWorking5: boolean | null;

  // ---------------------------

  @ApiPropertyOptional({ description: '경력6>회사이름', nullable: true })
  @Column({ comment: '경력6>회사이름', nullable: true })
  careerCompanyName6: string | null;

  @ApiPropertyOptional({ description: '경력6>역할', nullable: true })
  @Column({ comment: '경력6>역할', nullable: true })
  careerRole6: string | null;

  @ApiPropertyOptional({ description: '경력6>입사일자', nullable: true })
  @Column({ comment: '경력6>입사일자', nullable: true })
  careerJoinDate6: Date | null;

  @ApiPropertyOptional({ description: '경력6>퇴사일자', nullable: true })
  @Column({ comment: '경력6>퇴사일자', nullable: true })
  careerQuitDate6: Date | null;

  @ApiPropertyOptional({ description: '경력6>재직중 여부', nullable: true })
  @Column({ comment: '경력6>재직중 여부', nullable: true })
  careerIsWorking6: boolean | null;

  // ---------------------------

  @ApiPropertyOptional({ description: '경력7>회사이름', nullable: true })
  @Column({ comment: '경력7>회사이름', nullable: true })
  careerCompanyName7: string | null;

  @ApiPropertyOptional({ description: '경력7>역할', nullable: true })
  @Column({ comment: '경력7>역할', nullable: true })
  careerRole7: string | null;

  @ApiPropertyOptional({ description: '경력7>입사일자', nullable: true })
  @Column({ comment: '경력7>입사일자', nullable: true })
  careerJoinDate7: Date | null;

  @ApiPropertyOptional({ description: '경력7>퇴사일자', nullable: true })
  @Column({ comment: '경력7>퇴사일자', nullable: true })
  careerQuitDate7: Date | null;

  @ApiPropertyOptional({ description: '경력7>재직중 여부', nullable: true })
  @Column({ comment: '경력7>재직중 여부', nullable: true })
  careerIsWorking7: boolean | null;

  // ---------------------------

  @ApiPropertyOptional({ description: '경력8>회사이름', nullable: true })
  @Column({ comment: '경력8>회사이름', nullable: true })
  careerCompanyName8: string | null;

  @ApiPropertyOptional({ description: '경력8>역할', nullable: true })
  @Column({ comment: '경력8>역할', nullable: true })
  careerRole8: string | null;

  @ApiPropertyOptional({ description: '경력8>입사일자', nullable: true })
  @Column({ comment: '경력8>입사일자', nullable: true })
  careerJoinDate8: Date | null;

  @ApiPropertyOptional({ description: '경력8>퇴사일자', nullable: true })
  @Column({ comment: '경력8>퇴사일자', nullable: true })
  careerQuitDate8: Date | null;

  @ApiPropertyOptional({ description: '경력8>재직중 여부', nullable: true })
  @Column({ comment: '경력8>재직중 여부', nullable: true })
  careerIsWorking8: boolean | null;

  // ---------------------------

  @ApiPropertyOptional({ description: '경력9>회사이름', nullable: true })
  @Column({ comment: '경력9>회사이름', nullable: true })
  careerCompanyName9: string | null;

  @ApiPropertyOptional({ description: '경력9>역할', nullable: true })
  @Column({ comment: '경력9>역할', nullable: true })
  careerRole9: string | null;

  @ApiPropertyOptional({ description: '경력9>입사일자', nullable: true })
  @Column({ comment: '경력9>입사일자', nullable: true })
  careerJoinDate9: Date | null;

  @ApiPropertyOptional({ description: '경력9>퇴사일자', nullable: true })
  @Column({ comment: '경력9>퇴사일자', nullable: true })
  careerQuitDate9: Date | null;

  @ApiPropertyOptional({ description: '경력9>재직중 여부', nullable: true })
  @Column({ comment: '경력9>재직중 여부', nullable: true })
  careerIsWorking9: boolean | null;

  // ---------------------------

  @ApiPropertyOptional({ description: '경력10>회사이름', nullable: true })
  @Column({ comment: '경력10>회사이름', nullable: true })
  careerCompanyName10: string | null;

  @ApiPropertyOptional({ description: '경력10>역할', nullable: true })
  @Column({ comment: '경력10>역할', nullable: true })
  careerRole10: string | null;

  @ApiPropertyOptional({ description: '경력10>입사일자', nullable: true })
  @Column({ comment: '경력10>입사일자', nullable: true })
  careerJoinDate10: Date | null;

  @ApiPropertyOptional({ description: '경력10>퇴사일자', nullable: true })
  @Column({ comment: '경력10>퇴사일자', nullable: true })
  careerQuitDate10: Date | null;

  @ApiPropertyOptional({
    description: '경력10>재직중 여부',
    nullable: true,
    default: null,
  })
  @Column({ comment: '경력10>재직중 여부', default: null, nullable: true })
  careerIsWorking10: boolean | null;

  // --------------------------

  @ApiProperty({
    description: '스킬',
    default: '',
    example: 'React/React Native/Figma',
  })
  @Column({ comment: '스킬', default: '' })
  skill: string;

  @ApiPropertyOptional({
    description: '포트폴리오 url',
    nullable: true,
    default: null,
  })
  @Column({ comment: '포트폴리오 url', default: null, nullable: true })
  portfolioUrl: string | null;

  @ApiPropertyOptional({
    description: '포트폴리오 파일',
    nullable: true,
    default: null,
  })
  @Column({ comment: '포트폴리오 파일', default: null, nullable: true })
  portfolioFile: string | null;

  // --------------------------

  @ApiProperty({ description: '프로필을 등록한 사용자 정보' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
