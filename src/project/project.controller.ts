import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { HomeProjectResDto, PostProjectResDto } from './dto/response.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { EFileUsage } from 'src/type/file.type';

@Controller('project')
@ApiExtraModels(CreateProjectDto, PostProjectResDto, HomeProjectResDto)
@ApiTags('Project')
export class ProjectController {
  constructor(
    private readonly service: ProjectService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile NotFound',
  })
  @ApiResponse({
    status: 200,
    type: PostProjectResDto,
  })
  async create(
    @Request() req,
    @Body(new ValidationPipe()) data: CreateProjectDto,
  ) {
    const { id } = req.user.name;

    const { file } = data;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    let fileUrl: string | null = null;

    if (file) {
      const uploadedFile = await this.fileService.uploadFile(
        file,
        id,
        EFileUsage.PROJECT,
      );
      fileUrl = uploadedFile.url;
    }

    return this.service.create(data, id, fileUrl);
  }

  @Get('home')
  @ApiResponse({
    status: 200,
    type: HomeProjectResDto,
  })
  async getHomeProject() {
    return this.service.getHomeProject();
  }
}
