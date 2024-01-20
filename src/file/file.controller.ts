import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@Controller('file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    }

    return this.service.uploadFile(file, id);
  }
}
