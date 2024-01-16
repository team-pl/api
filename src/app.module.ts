import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import swaggerConfig from './config/swagger.config';

@Module({
  imports: [
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
    UserModule,
    AuthModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
