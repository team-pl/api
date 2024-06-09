import { Module, forwardRef } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from 'src/entity/like.entity';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    forwardRef(() => ProjectModule),
    TypeOrmModule.forFeature([Like]),
    RedisCacheModule,
  ],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
