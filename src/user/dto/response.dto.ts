import { ApiProperty } from '@nestjs/swagger';

export class GetUserResDto {
  @ApiProperty({ description: '사용자ID' })
  id: string;

  @ApiProperty({ description: '가입일' })
  createdAt: Date;

  @ApiProperty({ description: '사용자 정보 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '사용자 계정 삭제일' })
  deletedAt: Date | null;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '휴대폰 번호' })
  phone: string;

  @ApiProperty({ description: '이메일' })
  email: string;
}

export class PostUserResDto {
  @ApiProperty({ description: '사용자ID' })
  id: string;

  @ApiProperty({ description: '가입일' })
  createdAt: Date;

  @ApiProperty({ description: '사용자 정보 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '사용자 계정 삭제일' })
  deletedAt: Date | null;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '휴대폰 번호' })
  phone: string;

  @ApiProperty({ description: '이메일' })
  email: string;
}
