import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResDto } from './dto/response.dto';
import { LocalAuthGuard } from './localAuth.guard';
import {
  SwaggerGetResponse,
  SwaggerPostResponse,
} from 'src/decorator/swagger.decorator';
import { JwtAuthGuard } from './jwtAuth.guard';
import { GetUserResDto } from 'src/user/dto/response.dto';
import { KakaoAuthGuard } from './kakaoAuth.guard';

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
  async loginKakao(@Request() req, @Res() res) {
    const url = this.service.kakaoRedirect();
    return res.redirect(url);
  }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async getKakaoInfo(@Query() code: string, @Request() req, @Res() res) {
    console.log('user : ', req.user);
    const { name, email, profile } = req.user;
    const { accessToken, refreshToken, user } = await this.service.getJWT(
      req.user.kakaoId,
      name,
      email,
      profile,
    );
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @SwaggerGetResponse(GetUserResDto)
  @Get('myInfo')
  async getMyInfo(@Request() req) {
    const { name, phone } = req.user.name;
    return await this.service.userValidation(name, phone);
  }
}
