import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ESignUp } from 'src/type/user.type';

export class CreateTestUserDto {
  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '닉네임(별명)', nullable: true, default: null })
  nickname: string | null;

  @ApiProperty({ description: '휴대폰 번호' })
  phone: string;

  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiPropertyOptional({
    nullable: true,
    description:
      '카카오 ID(카카오에서 제공해주며, 카카오 소셜 로그인으로 가입한 사용자는 고유 ID를 가짐)',
    default: null,
  })
  kakaoId?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description:
      '네이버 ID(네이버에서 제공해주며, 네이버 소셜 로그인으로 가입한 사용자는 고유 ID를 가짐)',
    default: null,
  })
  naverId?: string | null;

  @ApiProperty({
    description: '회원가입 종류(네이버/카카오)',
    default: ESignUp.KAKAO,
  })
  signUpType: ESignUp;

  @ApiProperty({
    description: '직업 종류',
    nullable: true,
    default: null,
  })
  jobType: string | null;
}
