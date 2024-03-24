import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResDto } from './dto/response.dto';
import { SwaggerGetResponse } from 'src/decorator/swagger.decorator';
import { JwtAuthGuard } from './jwtAuth.guard';
import { GetUserResDto } from 'src/user/dto/response.dto';
import { KakaoAuthGuard } from './kakaoAuth.guard';
import { NaverAuthGuard } from './naver.guard';
import { config } from 'dotenv';
import { cookieOption } from 'src/lib/cookie';
import { LoginKaKaoDto } from './dto/login-kakao.dto';
import { LoginNaverDto } from './dto/login-naver.dto';
// import * as session from 'express-session';

config();

@Controller('auth')
@ApiExtraModels(LoginResDto, LoginKaKaoDto, LoginNaverDto)
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @SwaggerPostResponse(LoginResDto)
  // @Post('login')
  // async login(@Request() req) {
  //   const { name, phone, email } = req.user;
  //   return this.service.login(name, phone, email);
  // }

  // // @UseGuards(KakaoAuthGuard)
  // @SwaggerPostResponse(LoginResDto)
  // @Post('login-naver')
  // async loginNaver(@Request() req) {
  //   const { name, phone, email } = req.user;
  //   return this.service.login(name, phone, email);
  // }

  // @UseGuards(KakaoAuthGuard)
  // @Get('login-kakao')
  // async loginKakao(@Res() res) {
  //   const url = this.service.kakaoRedirect();
  //   return res.redirect(url);
  // }

  // NOTE: 새로운 카카오 로그인 방식
  @Post('login-kakao')
  @ApiOperation({ summary: '카카오 로그인 버튼 클릭 후 호출되는 API' })
  async loginKakao(@Body(new ValidationPipe()) data: LoginKaKaoDto) {
    return await this.service.loginKakao(data.authCode);
  }

  // NOTE: 새로운 네이버 로그인 방식
  @Post('login-naver')
  @ApiOperation({ summary: '네이버 로그인 버튼 클릭 후 호출되는 API' })
  async loginNaver(@Body(new ValidationPipe()) data: LoginNaverDto) {
    console.log('authCode : ', data.authCode);
    return await this.service.loginNaver(data.authCode);
  }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async getKakaoInfo(@Request() req, @Res() res) {
    const { name, email } = req.user;
    const { accessToken, refreshToken, user, isNewUser } =
      await this.service.getKakaoJWT(req.user.kakaoId, name, email);

    res.cookie('accessToken', accessToken, cookieOption);
    res.cookie('refreshToken', refreshToken, cookieOption);

    console.log('protocol : ', req.protocol);

    if (isNewUser) {
      res.redirect(process.env.SIGNUP_KAKAO_REDIRECT_URL);
    } else {
      res.redirect(process.env.SIGNUP_REDIRECT_URL);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @SwaggerGetResponse(GetUserResDto)
  @Get('myInfo')
  async getMyInfo(@Request() req) {
    const { name, phone } = req.user.name;
    return await this.service.userValidation(name, phone);
  }

  // @UseGuards(NaverAuthGuard)
  // @Get('login-naver')
  // async loginNaver(@Request() req, @Res() res) {
  //   const api_url =
  //     'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' +
  //     process.env.NAVER_CLIENT_ID +
  //     '&redirect_uri=' +
  //     process.env.NAVER_CALLBACK_URL;
  //   res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
  //   res.end(
  //     "<a href='" +
  //       api_url +
  //       "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>",
  //   );
  // }

  @UseGuards(NaverAuthGuard)
  @Get('naver')
  async getNaverInfo(@Request() req, @Res() res) {
    const { name, email } = req.user;
    const { accessToken, refreshToken, user, isNewUser } =
      await this.service.getNaverJWT(req.user.naverId, name, email);

    res.cookie('accessToken', accessToken, cookieOption);
    res.cookie('refreshToken', refreshToken, cookieOption);

    if (isNewUser) {
      res.redirect(process.env.SIGNUP_KAKAO_REDIRECT_URL);
    } else {
      res.redirect(process.env.SIGNUP_REDIRECT_URL);
    }
    return user;
  }
}
