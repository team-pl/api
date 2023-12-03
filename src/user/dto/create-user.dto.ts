import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자 이름',
    example: '임지현',
  })
  name: string;

  @IsPhoneNumber('KR')
  @IsNotEmpty()
  @ApiProperty({
    description: '휴대폰번호',
    example: '010-1234-5678',
  })
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: '이메일주소',
    example: 'aa@gamil.com',
  })
  email: string;
}
