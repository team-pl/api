import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '사용자 이름',
    example: '임지현',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '휴대폰번호',
    example: '010-1234-5678',
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '이메일주소',
    example: 'aa@gamil.com',
  })
  email?: string;
}
