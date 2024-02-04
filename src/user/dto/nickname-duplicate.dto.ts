import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NicknameDuplicateDto {
  @IsString()
  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;
}
