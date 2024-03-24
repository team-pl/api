import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginKaKaoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '카카오 인가코드',
  })
  authCode: string | string[];
}
