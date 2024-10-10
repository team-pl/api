import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from 'src/notification/notification.module';
import { ProjectModule } from 'src/project/project.module';
import { LikeModule } from 'src/like/like.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationModule,
    ProjectModule,
    // LikeModule,
    // RedisCacheModule,
  ], // 스케줄 모듈을 전역에서 사용할 수 있도록 초기화
  providers: [CronService],
})
export class CronModule {}
