import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
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

@Controller('auth')
@ApiExtraModels(LoginResDto)
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @SwaggerPostResponse(LoginResDto)
  @Post('login')
  async login(@Request() req) {
    const { name, phone, email } = req.user;
    return this.service.login(name, phone, email);
  }

  @UseGuards(JwtAuthGuard)
  @SwaggerGetResponse(GetUserResDto)
  @Get('myInfo')
  async getMyInfo(@Request() req) {
    const { name, phone } = req.user.name;
    return await this.service.userValidation(name, phone);
  }
}
