import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  DeleteProjectResDto,
  GetOneProjectResDto,
  HomeProjectResDto,
  PostProjectResDto,
  ProjectDataResDto,
  UpdateProjectResDto,
} from './dto/response.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { EFileUsage } from 'src/type/file.type';
import { GetProjectQueryDto } from './dto/get-project.dto';
import { ECategorySelect, ESubCategorySelect } from 'src/type/project.type';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTestProjectDto } from './dto/create-test-project.dto';
import { JwtOptionalAuthGuard } from 'src/auth/jwtOptionalAuth.guard';

@Controller('project')
@ApiExtraModels(
  CreateProjectDto,
  PostProjectResDto,
  HomeProjectResDto,
  GetProjectQueryDto,
  ProjectDataResDto,
  DeleteProjectResDto,
  UpdateProjectResDto,
  GetOneProjectResDto,
  CreateTestProjectDto,
)
@ApiTags('프로젝트')
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

  // // NOTE: 테스트 프로젝트 생성 API
  // @Post('test')
  // @ApiOperation({ summary: '테스트 프로젝트 등록 API' })
  // @ApiResponse({
  //   status: 401,
  //   description: 'user ID NotFound',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Profile NotFound',
  // })
  // @ApiResponse({
  //   status: 200,
  //   type: PostProjectResDto,
  // })
  // async createTestProject(
  //   @Body(new ValidationPipe()) data: CreateTestProjectDto,
  // ) {
  //   return this.service.createTest(data);
  // }

  @Patch(':id')
  @ApiOperation({ summary: '프로젝트 수정 API' })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({
    name: 'id',
    required: true,
    description: '수정할 프로젝트 ID',
  })
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
    type: UpdateProjectResDto,
  })
  async update(
    @Request() req,
    @Body(new ValidationPipe()) data: UpdateProjectDto,
    @Param('id') projectId: string,
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

    return this.service.updateProject(projectId, data, fileUrl);
  }

  @Get()
  @ApiOperation({ summary: '프로젝트 찾기>목록 조회 API' })
  @UseGuards(JwtOptionalAuthGuard)
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
    @Request() req,
    @Query('skip') skip: string,
    @Query('take') take?: string,
    @Query('category') category?: ECategorySelect,
    @Query('subCategory') subCategory?: ESubCategorySelect,
    @Query('searchWord') searchWord?: string,
  ) {
    const userId = req.user?.id;
    return this.service.getProjectList({
      skip,
      take,
      category,
      subCategory,
      searchWord,
      userId,
    });
  }

  @Get('home')
  @ApiOperation({ summary: '홈>인기/신규 프로젝트 목록 조회 API' })
  @UseGuards(JwtOptionalAuthGuard)
  @ApiResponse({
    status: 200,
    type: HomeProjectResDto,
  })
  async getHomeProject(@Request() req) {
    return this.service.getHomeProject(req.user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '프로젝트 상세 조회 API' })
  @UseGuards(JwtOptionalAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '조회할 프로젝트 ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Project NotFound',
  })
  @ApiResponse({
    status: 200,
    type: GetOneProjectResDto,
  })
  getOneProject(@Param('id') id: string, @Request() req) {
    return this.service.getOneProject(id, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '프로젝트 삭제 API' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '삭제할 프로젝트 ID',
  })
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
    type: DeleteProjectResDto,
  })
  deleteProject(@Param('id') projectId: string, @Request() req) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.deleteProject(projectId);
  }
}
