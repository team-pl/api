import { UserService } from './../user/user.service';
import { Injectable, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/user.entity';

config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async userValidation(name: string, id: string) {
    const user = await this.userService.findUser(name, id);

    if (user) return user;

    return null;
  }

  async login(name: string, phone: string, email: string) {
    const jwtPayload = {
      name,
      phone,
      email,
    };

    const accessToken = this.jwtService.sign(jwtPayload);

    return {
      accessToken,
    };
  }

  async generateAccessToken(user: User) {
    const jwtPayload = {
      id: user.id,
    };

    const accessToken = this.jwtService.sign(jwtPayload);

    return accessToken;
  }

  async kakaoRedirect() {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_CALLBACK_URL}`;
    return url;
  }

  // async kakaoLogin(code: string) {
  //   const config = {
  //     grant_type: 'authorization_code',
  //     client_id: process.env.KAKAO_CLIENT_ID,
  //     redirect_uri: process.env.KAKAO_CALLBACK_URL,
  //     client_secret: process.env.KAKAO_CLIENT_SECRET,
  //     code,
  //   };
  //   const params = new URLSearchParams(config).toString();
  //   const tokenHeaders = {
  //     'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
  //   };
  //   const tokenUrl = `https://kauth.kakao.com/oauth/token?${params}`;

  //   const res = await firstValueFrom(
  //     this.httpService.post(tokenUrl, {
  //       headers: tokenHeaders,
  //     }),
  //   );

  //   console.log(res.data);
  // }

  async kakaoValidateUser(
    kakaoId: string,
    name: string,
    email: string,
    profile: string,
  ): Promise<{ user: User; isNewUser: boolean }> {
    let isNewUser = false;
    let user = await this.userService.getUserByKakaoId(kakaoId);
    if (!user) {
      user = await this.userService.kakaoSignUp(kakaoId, name, email, profile);
    }
    if (!user.phone) {
      isNewUser = true;
    }
    return {
      user,
      isNewUser,
    };
  }

  async naverValidateUser(
    naverId: string,
    name: string,
    email: string,
    profile: string,
    phone: string = '',
  ): Promise<{ user: User; isNewUser: boolean }> {
    let isNewUser = false;
    let user = await this.userService.getUserByNaverId(naverId);
    if (!user) {
      user = await this.userService.naverSignUp(
        naverId,
        name,
        email,
        profile,
        phone,
      );
    }
    if (!user.phone) {
      isNewUser = true;
    }
    return {
      user,
      isNewUser,
    };
  }

  async generateRefreshToken(user: User) {
    const jwtPayload = {
      id: user.id,
    };

    const token = this.jwtService.sign(jwtPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    const saltOrRounds = 10;
    const refreshToken = await bcrypt.hash(token, saltOrRounds);

    await this.userService.setRefreshToken(user.id, refreshToken);

    return refreshToken;
  }

  async getKakaoJWT(
    kakaoId: string,
    name: string,
    email: string,
    profile: string,
  ) {
    const { user, isNewUser } = await this.kakaoValidateUser(
      kakaoId,
      name,
      email,
      profile,
    );
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user); // refreshToken 생성
    return { accessToken, refreshToken, user, isNewUser };
  }

  async getNaverJWT(
    kakaoId: string,
    name: string,
    email: string,
    profile: string,
    phone: string,
  ) {
    const { user, isNewUser } = await this.naverValidateUser(
      kakaoId,
      name,
      email,
      profile,
      phone,
    );
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user); // refreshToken 생성
    return { accessToken, refreshToken, user, isNewUser };
  }
}
