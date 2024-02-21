import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: '프로필 이미지',
  })
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '직책 혹은 전공',
    example: '엔지니어',
  })
  jobType: string;
}
