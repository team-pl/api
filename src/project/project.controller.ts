import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  HomeProjectResDto,
  PostProjectResDto,
  ProjectDataResDto,
} from './dto/response.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { EFileUsage } from 'src/type/file.type';
import { GetProjectQueryDto } from './dto/get-project.dto';
import { ECategorySelect, ESubCategorySelect } from 'src/type/project.type';

@Controller('project')
@ApiExtraModels(
  CreateProjectDto,
  PostProjectResDto,
  HomeProjectResDto,
  GetProjectQueryDto,
  ProjectDataResDto,
)
@ApiTags('Project')
export class ProjectController {
  constructor(
    private readonly service: ProjectService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @ApiOperation({ summary: '프로젝트 등록 API' })
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

  @Get()
  @ApiOperation({ summary: '프로젝트 찾기>목록 조회 API' })
  @ApiQuery({
    name: 'skip',
    required: true,
    description: '현재까지 조회한 프로젝트 개수',
    type: 'string',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: 'string',
    description: '조회하려는 프로젝트 개수',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: '조회 카테고리',
    enum: ECategorySelect,
  })
  @ApiQuery({
    name: 'subCategory',
    required: false,
    description: '조회 하위카테고리',
    enum: ESubCategorySelect,
  })
  @ApiQuery({
    name: 'searchWord',
    required: false,
    type: 'string',
    description: '검색어',
  })
  @ApiResponse({
    status: 200,
    type: ProjectDataResDto,
  })
  async getProjectList(
    @Query('skip') skip: string,
    @Query('take') take?: string,
    @Query('category') category?: ECategorySelect,
    @Query('subCategory') subCategory?: ESubCategorySelect,
    @Query('searchWord') searchWord?: string,
  ) {
    return this.service.getProjectList({
      skip,
      take,
      category,
      subCategory,
      searchWord,
    });
  }

  @Get('home')
  @ApiOperation({ summary: '홈>인기/신규 프로젝트 목록 조회 API' })
  @ApiResponse({
    status: 200,
    type: HomeProjectResDto,
  })
  async getHomeProject() {
    return this.service.getHomeProject();
  }
}
