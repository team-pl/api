import { UserService } from './../user/user.service';
import { Injectable, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/user.entity';
import axios from 'axios';

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
  ): Promise<{ user: User; isNewUser: boolean }> {
    let isNewUser = false;
    let user = await this.userService.getUserByKakaoId(kakaoId);
    if (!user) {
      user = await this.userService.kakaoSignUp(kakaoId, name, email);
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
  ): Promise<{ user: User; isNewUser: boolean }> {
    let isNewUser = false;
    let user = await this.userService.getUserByNaverId(naverId);
    if (!user) {
      user = await this.userService.naverSignUp(naverId, name, email);
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

  async getKakaoJWT(kakaoId: string, name: string, email: string) {
    const { user, isNewUser } = await this.kakaoValidateUser(
      kakaoId,
      name,
      email,
    );
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user); // refreshToken 생성
    return { accessToken, refreshToken, user, isNewUser };
  }

  async getNaverJWT(naverId: string, name: string, email: string) {
    const { user, isNewUser } = await this.naverValidateUser(
      naverId,
      name,
      email,
    );
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user); // refreshToken 생성
    return { accessToken, refreshToken, user, isNewUser };
  }

  // NOTE: 인가코드를 카카오에 전달 -> token 받아오기
  async authCodeToKakao(authCode: string | string[]) {
    const tokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URL}&code=${authCode}&client_secret=${process.env.KAKAO_CLIENT_SECRET}`;

    const response = await axios
      .post(
        tokenUrl,
        {},
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      )
      .then((res) => res.data.access_token);

    return response;
  }

  // NOTE: 카카오로부터 유저 정보 가져오기
  async userDataFromKakao(token: string) {
    const url = 'https://kapi.kakao.com/v2/user/me';
    const response = await axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    console.log('data : ', response);
    return response;
  }

  // NOTE: 네이버로부터 유저 정보 가져오기
  async userDataFromNaver(token: string) {
    const url = 'https://openapi.naver.com/v1/nid/me';
    const response = await axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    console.log('data : ', response);
    return response;
  }

  // NOTE: 새로운 카카오 로그인 방식
  async loginKakao(authCode: string | string[]) {
    const token = await this.authCodeToKakao(authCode);

    const { id, kakao_account } = await this.userDataFromKakao(token);

    const { email, profile } = kakao_account;
    const { accessToken, refreshToken, user, isNewUser } =
      await this.getKakaoJWT(id, profile.nickname, email);

    return {
      user,
      accessToken,
      refreshToken,
      isNewUser,
    };
  }

  // NOTE: 새로운 네이버 로그인 방식
  async loginNaver(authCode: string) {
    const token = authCode;

    const { response } = await this.userDataFromNaver(token);

    const { id, email, name } = response;
    const { accessToken, refreshToken, user, isNewUser } =
      await this.getNaverJWT(id, name, email);

    return {
      user,
      accessToken,
      refreshToken,
      isNewUser,
    };
  }
}
