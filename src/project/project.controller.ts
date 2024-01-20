import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { SwaggerPostResponse } from 'src/decorator/swagger.decorator';
import { PostProjectResDto } from './dto/response.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';

@Controller('project')
@ApiExtraModels(CreateProjectDto, PostProjectResDto)
@ApiTags('Project')
export class ProjectController {
  constructor(
    private readonly service: ProjectService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @SwaggerPostResponse(PostProjectResDto)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Request() req,
    @Body(new ValidationPipe()) data: CreateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    }

    let fileUrl = null;

    if (file) {
      const uploadedFile = await this.fileService.uploadFile(file, id);
      fileUrl = uploadedFile.url;
    }

    return this.service.create(data, id, fileUrl);
  }
}
