import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class SignupUserDto {
  @IsString()
  @ApiProperty({
    description: '사용자 이름',
  })
  name: string;

  @IsPhoneNumber('KR')
  @ApiProperty({
    description: '휴대폰번호',
    example: '010-1234-5678',
  })
  phone: string;

  @IsString()
  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;
}
