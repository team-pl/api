import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'src/entity/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
