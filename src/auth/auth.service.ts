import { TAuthUser, TLoginUser } from 'src/type/user.type';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async userValidation(name: string, phone: string) {
    const user = await this.userService.findUser(name, phone);

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
}
