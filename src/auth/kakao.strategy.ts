import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('카카오 프로필 : ', profile);

    return {
      name: profile.username,
      email: profile._json.kakao_account.email,
      kakaoId: profile._json.id,
      profile: profile._json.properties.profile_image,
      accessToken,
      refreshToken,
    };
  }
}
