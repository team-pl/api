import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  })
  @Column({ comment: 'Refresh Token', default: null, nullable: true })
  refreshToken: string | null;

  @ApiProperty({
    description: '프로필사진 url',
    nullable: true,
  })
  @Column({ comment: '프로필사진 url', default: null, nullable: true })
  profile: string | null;
}
