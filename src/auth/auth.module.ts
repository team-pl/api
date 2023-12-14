import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { KakaoStrategy } from './kakao.strategy';

config();

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '1h',
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, KakaoStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
