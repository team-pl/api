import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'name', passwordField: 'phone' });
  }

  async validate(name: string, phone: string) {
    const user = await this.authService.userValidation(name, phone);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
