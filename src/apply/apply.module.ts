import { Module, forwardRef } from '@nestjs/common';
import { ApplyService } from './apply.service';
import { ApplyController } from './apply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apply } from 'src/entity/apply.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Apply]),
    forwardRef(() => ProjectModule),
    NotificationModule,
  ],
  providers: [ApplyService],
  controllers: [ApplyController],
  exports: [ApplyService],
})
export class ApplyModule {}
