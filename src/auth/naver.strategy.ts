import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      name: profile.name,
      email: profile.email,
      naverId: profile.id,
      accessToken,
      refreshToken,
    };
  }
}
