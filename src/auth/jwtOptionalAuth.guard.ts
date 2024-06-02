import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config } from 'dotenv';

config();

@Injectable()
export class JwtOptionalAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
    // console.log('JwtService has been injected:', !!jwtService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secretKey = process.env.SECRET_KEY;

      try {
        const verify = this.jwtService.verify(token, { secret: secretKey });
        request.user = verify;
      } catch (e) {
        console.log('Token verification failed:', e.message);
      }
    }

    return true;
  }
}
