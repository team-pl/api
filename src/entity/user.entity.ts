import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @ApiProperty({ description: '가입일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '사용자 정보 수정일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '이름' })
  @Column()
  name: string;

  @ApiProperty({ description: '휴대폰 번호' })
  @Column()
  phone: string;

  @ApiProperty({ description: '이메일' })
  @Column()
  email: string;
}
