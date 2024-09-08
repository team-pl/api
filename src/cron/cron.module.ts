import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from 'src/notification/notification.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [ScheduleModule.forRoot(), NotificationModule, ProjectModule], // 스케줄 모듈을 전역에서 사용할 수 있도록 초기화
  providers: [CronService],
})
export class CronModule {}