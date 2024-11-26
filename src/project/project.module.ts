import { Module, forwardRef } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entity/project.entity';
import { FileModule } from 'src/file/file.module';
import { ProfileModule } from 'src/profile/profile.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LikeModule } from 'src/like/like.module';
import { ApplyModule } from 'src/apply/apply.module';

@Module({
  imports: [
    forwardRef(() => LikeModule),
    forwardRef(() => ApplyModule),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([Project]),
    FileModule,
    ProfileModule,
    UserModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
