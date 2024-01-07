import {
  Controller,
  Get,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResDto } from './dto/response.dto';
import { SwaggerGetResponse } from 'src/decorator/swagger.decorator';
import { JwtAuthGuard } from './jwtAuth.guard';
import { GetUserResDto } from 'src/user/dto/response.dto';
import { KakaoAuthGuard } from './kakaoAuth.guard';
import { NaverAuthGuard } from './naver.guard';
import { config } from 'dotenv';
import { cookieOption } from 'src/lib/cookie';
// import * as session from 'express-session';

config();

@Controller('auth')
@ApiExtraModels(LoginResDto)
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

  @UseGuards(KakaoAuthGuard)
  @Get('login-kakao')
  async loginKakao(@Res() res) {
    const url = this.service.kakaoRedirect();
    return res.redirect(url);
  }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async getKakaoInfo(@Request() req, @Res() res) {
    const { name, email, profile } = req.user;
    const { accessToken, refreshToken, user, isNewUser } =
      await this.service.getKakaoJWT(req.user.kakaoId, name, email, profile);

    res.cookie('accessToken', accessToken, cookieOption);
    res.cookie('refreshToken', refreshToken, cookieOption);

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

  @UseGuards(NaverAuthGuard)
  @Get('login-naver')
  async loginNaver(@Request() req, @Res() res) {
    const api_url =
      'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' +
      process.env.NAVER_CLIENT_ID +
      '&redirect_uri=' +
      process.env.NAVER_CALLBACK_URL;
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end(
      "<a href='" +
        api_url +
        "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>",
    );
  }

  @UseGuards(NaverAuthGuard)
  @Get('naver')
  async getNaverInfo(@Request() req, @Res() res) {
    const { name, email, profile, phone } = req.user;
    const { accessToken, refreshToken, user } = await this.service.getNaverJWT(
      req.user.naverId,
      name,
      email,
      profile,
      phone,
    );
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.redirect(process.env.SIGNUP_REDIRECT_URL);
    return user;
  }
}
