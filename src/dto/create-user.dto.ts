import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자 이름',
    required: true,
    example: '임지현',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '휴대폰번호',
    required: true,
    example: '010-1234-5678',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '이메일주소',
    required: true,
    example: 'aa@gamil.com',
  })
  email: string;
}
