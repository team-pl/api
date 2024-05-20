import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { FileModule } from './file/file.module';
import { ProfileModule } from './profile/profile.module';
import { CommentModule } from './comment/comment.module';
import { EmailModule } from './email/email.module';
import { NotificationModule } from './notification/notification.module';
import { ApplyModule } from './apply/apply.module';
import { LikeModule } from './like/like.module';
import { RedisCacheService } from './redis-cache/redis-cache.service';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import swaggerConfig from './config/swagger.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        connectTimeout: 10000,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [swaggerConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: parseInt(process.env.PORT),
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DB,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: false,
      logging: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    ProjectModule,
    FileModule,
    ProfileModule,
    CommentModule,
    EmailModule,
    NotificationModule,
    ApplyModule,
    LikeModule,
    RedisCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisCacheService],
})
export class AppModule {}
