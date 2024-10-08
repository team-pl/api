import { ApiProperty } from '@nestjs/swagger';
import { ECategory1, ECategory2, EProjectState } from 'src/type/project.type';
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

@Entity({ name: 'project' })
export class Project {
  @PrimaryColumn({ name: 'id', comment: '프로젝트 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로젝트 등록일' })
  @CreateDateColumn({ comment: '프로젝트 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로젝트 정보 수정일' })
  @UpdateDateColumn({ comment: '프로젝트 정보 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '프로젝트 삭제일' })
  @DeleteDateColumn({ comment: '프로젝트 삭제일' })
  deletedAt: Date;

  @ApiProperty({ description: '프로젝트명', default: '' })
  @Column({ comment: '프로젝트명', default: '' })
  name: string;

  @ApiProperty({
    description: '프로젝트 모집 상태',
    default: EProjectState.RECRUITING,
    enum: EProjectState,
  })
  @Column({
    comment: '프로젝트 모집 상태',
    default: EProjectState.RECRUITING,
    enum: EProjectState,
  })
  state: EProjectState;

  @ApiProperty({ description: '프로젝트 모집마감일' })
  @Column({ comment: '프로젝트 모집마감일' })
  recruitExpiredAt: Date;

  @ApiProperty({ description: '프로젝트 모집인원', default: 0 })
  @Column({ comment: '프로젝트 모집인원', default: 0 })
  recruitTotalNumber: number;

  @ApiProperty({ description: '프로젝트 확정인원', default: 0 })
  @Column({ comment: '프로젝트 확정인원', default: 0 })
  confirmedNumber: number;

  @ApiProperty({ description: '프로젝트 개발자 모집인원', default: 0 })
  @Column({ comment: '프로젝트 개발자 모집인원', default: 0 })
  recruitDevTotalNumber: number;

  @ApiProperty({ description: '프로젝트 디자이너 모집인원', default: 0 })
  @Column({ comment: '프로젝트 디자이너 모집인원', default: 0 })
  recruitDesignTotalNumber: number;

  @ApiProperty({ description: '프로젝트 기타 모집인원', default: 0 })
  @Column({ comment: '프로젝트 기타 모집인원', default: 0 })
  recruitEtcTotalNumber: number;

  @ApiProperty({ description: '프로젝트 총 지원인원', default: 0 })
  @Column({ comment: '프로젝트 총 지원인원', default: 0 })
  applicantTotalNumber: number;

  @ApiProperty({
    description: '프로젝트 모집 카테고리',
    example: 'DEVELOPER/DESIGN/ETC',
  })
  @Column({ comment: '프로젝트 모집 카테고리' })
  recruitCategory: string;

  @ApiProperty({
    description: '프로젝트 모집 하위카테고리',
    example: 'DEV_BE/DEV_FE/DESIGN_UX/DESIGN_ETC',
  })
  @Column({ comment: '프로젝트 모집 하위카테고리' })
  recruitSubCategory: string;

  @ApiProperty({
    description: '프로젝트 모집글을 작성한 사용자 이름',
  })
  @Column({ comment: '프로젝트 모집글을 작성한 사용자 이름' })
  userName: string;

  @ApiProperty({ description: '프로젝트 조회수', default: 0 })
  @Column({ comment: '프로젝트 조회수', default: 0 })
  numberOfViews: number;

  @ApiProperty({ description: '프로젝트 좋아요수', default: 0 })
  @Column({ comment: '프로젝트 좋아요수', default: 0 })
  numberOfLikes: number;

  @ApiProperty({ description: '프로젝트 인기 score', default: 0 })
  @Column({ comment: '프로젝트 인기 score', default: 0 })
  numberOfScore: number;

  @ApiProperty({ description: '프로젝트 모집내용', default: '' })
  @Column('bytea', { comment: '프로젝트 모집내용', default: '' })
  content: Buffer;

  @ApiProperty({ description: '프로젝트 관련 참고 url', nullable: true })
  @Column({ comment: '프로젝트 관련 참고 url', default: null, nullable: true })
  url: string | null;

  @ApiProperty({ description: '프로젝트 관련 파일', nullable: true })
  @Column({ comment: '프로젝트 관련 파일', default: null, nullable: true })
  file: string | null;

  @ApiProperty({ description: '프로젝트 모집자가 선택한 프로필 ID' })
  @Column({ comment: '프로젝트 모집자가 선택한 프로필 ID' })
  profileId: string;

  @ApiProperty({ description: '프로젝트 모집자의 ID (user_entity.id)' })
  @Column({ comment: '프로젝트 모집자의 ID (user_entity.id)', default: '' })
  userId: string;

  @ApiProperty({
    description: '프로젝트 카테고리1의 카테고리1',
    default: ECategory1.DEVELOPER,
  })
  @Column({
    comment: '프로젝트 카테고리1의 카테고리1',
    default: ECategory1.DEVELOPER,
  })
  category1_1: ECategory1;

  @ApiProperty({
    description: '프로젝트 카테고리1의 카테고리2',
    default: ECategory2.DEV_BE,
  })
  @Column({
    comment: '프로젝트 카테고리1의 카테고리2',
    default: ECategory2.DEV_BE,
  })
  category1_2: ECategory2;

  @ApiProperty({ description: '프로젝트 카테고리1의 모집인원', default: 0 })
  @Column({ comment: '프로젝트 카테고리1의 모집인원', default: 0 })
  category1Number: number;

  @ApiProperty({
    description: '프로젝트 카테고리2의 카테고리1',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리2의 카테고리1',
    default: null,
    nullable: true,
  })
  category2_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리2의 카테고리2',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리2의 카테고리2',
    default: null,
    nullable: true,
  })
  category2_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리2의 모집인원', nullable: true })
  @Column({
    comment: '프로젝트 카테고리2의 모집인원',
    default: null,
    nullable: true,
  })
  category2Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리3의 카테고리1',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리3의 카테고리1',
    default: null,
    nullable: true,
  })
  category3_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리3의 카테고리2',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리3의 카테고리2',
    default: null,
    nullable: true,
  })
  category3_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리3의 모집인원', nullable: true })
  @Column({
    comment: '프로젝트 카테고리3의 모집인원',
    default: null,
    nullable: true,
  })
  category3Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리4의 카테고리1',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리4의 카테고리1',
    default: null,
    nullable: true,
  })
  category4_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리4의 카테고리2',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리4의 카테고리2',
    default: null,
    nullable: true,
  })
  category4_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리4의 모집인원', nullable: true })
  @Column({
    comment: '프로젝트 카테고리4의 모집인원',
    default: null,
    nullable: true,
  })
  category4Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리5의 카테고리1',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리5의 카테고리1',
    default: null,
    nullable: true,
  })
  category5_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리5의 카테고리2',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리5의 카테고리2',
    default: null,
    nullable: true,
  })
  category5_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리5의 모집인원', nullable: true })
  @Column({
    comment: '프로젝트 카테고리5의 모집인원',
    default: null,
    nullable: true,
  })
  category5Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리6의 카테고리1',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리6의 카테고리1',
    default: null,
    nullable: true,
  })
  category6_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리6의 카테고리2',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리6의 카테고리2',
    default: null,
    nullable: true,
  })
  category6_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리6의 모집인원', nullable: true })
  @Column({
    comment: '프로젝트 카테고리6의 모집인원',
    default: null,
    nullable: true,
  })
  category6Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리7의 카테고리1',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리7의 카테고리1',
    default: null,
    nullable: true,
  })
  category7_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리7의 카테고리2',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리7의 카테고리2',
    default: null,
    nullable: true,
  })
  category7_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리7의 모집인원', nullable: true })
  @Column({
    comment: '프로젝트 카테고리7의 모집인원',
    default: null,
    nullable: true,
  })
  category7Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리8의 카테고리1',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리8의 카테고리1',
    default: null,
    nullable: true,
  })
  category8_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리8의 카테고리2',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리8의 카테고리2',
    default: null,
    nullable: true,
  })
  category8_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리8의 모집인원', nullable: true })
  @Column({
    comment: '프로젝트 카테고리8의 모집인원',
    default: null,
    nullable: true,
  })
  category8Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리9의 카테고리1',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리9의 카테고리1',
    default: null,
    nullable: true,
  })
  category9_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리9의 카테고리2',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리9의 카테고리2',
    default: null,
    nullable: true,
  })
  category9_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리9의 모집인원', nullable: true })
  @Column({
    comment: '프로젝트 카테고리9의 모집인원',
    default: null,
    nullable: true,
  })
  category9Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 카테고리1',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리10의 카테고리1',
    default: null,
    nullable: true,
  })
  category10_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 카테고리2',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리10의 카테고리2',
    default: null,
    nullable: true,
  })
  category10_2: ECategory2 | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 모집인원',
    nullable: true,
  })
  @Column({
    comment: '프로젝트 카테고리10의 모집인원',
    default: null,
    nullable: true,
  })
  category10Number: number | null;

  @ApiProperty({ description: '프로젝트를 등록한 사용자 정보' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
