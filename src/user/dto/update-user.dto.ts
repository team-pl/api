import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '사용자 이름',
  })
  name?: string;

  @IsPhoneNumber('KR')
  @IsOptional()
  @ApiPropertyOptional({
    description: '휴대폰번호',
    example: '010-1234-5678',
  })
  phone?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    description: '이메일주소',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '대표 프로필 ID',
  })
  representativeProfileId?: string;
}
