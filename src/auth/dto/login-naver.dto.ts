import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginNaverDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '네이버 토큰',
  })
  authCode: string;
}
