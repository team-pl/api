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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { FileService } from 'src/file/file.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileDto } from './dto/create-profile.dto';
import { EFileUsage } from 'src/type/file.type';
import {
  DeleteProfileResDto,
  GetOneProfileResDto,
  GetProfileExistsResDto,
  GetProfileListResDto,
  PostProfileResDto,
  PostTempProfileResDto,
  UpdateProfileResDto,
} from './dto/response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileTempDto } from './dto/create-profile-temporary.dto';
import { CreateTestProfileDto } from './dto/create-test-profile.dto';

@Controller('profile')
@ApiExtraModels(
  CreateProfileDto,
  PostProfileResDto,
  DeleteProfileResDto,
  UpdateProfileDto,
  UpdateProfileResDto,
  CreateProfileTempDto,
  PostTempProfileResDto,
  CreateTestProfileDto,
  GetProfileListResDto,
  GetOneProfileResDto,
  GetProfileExistsResDto,
)
@ApiTags('프로필')
export class ProfileController {
  constructor(
    private readonly service: ProfileService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '프로필 등록 API' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 403,
    description: '등록 가능한 프로필 개수를 초과했습니다.',
  })
  @ApiResponse({
    status: 200,
    type: PostProfileResDto,
  })
  async create(
    @Request() req,
    @Body(new ValidationPipe()) data: CreateProfileDto,
  ) {
    const { id } = req.user.name;

    const { portfolioFile } = data;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    let fileUrl: string | null = null;

    if (portfolioFile) {
      const uploadedFile = await this.fileService.uploadFile(
        portfolioFile,
        id,
        EFileUsage.PROFILE,
      );
      fileUrl = uploadedFile.url;
    }

    return this.service.create(data, id, fileUrl);
  }

  @Post('temporary-storage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '프로필 임시저장 API' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 403,
    description: '등록 가능한 프로필 개수를 초과했습니다.',
  })
  @ApiResponse({
    status: 200,
    type: PostTempProfileResDto,
  })
  async temporaryStorage(
    @Request() req,
    @Body(new ValidationPipe()) data: CreateProfileTempDto,
  ) {
    const { id } = req.user.name;

    const { portfolioFile } = data;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    let fileUrl: string | null = null;

    if (portfolioFile) {
      const uploadedFile = await this.fileService.uploadFile(
        portfolioFile,
        id,
        EFileUsage.PROFILE,
      );
      fileUrl = uploadedFile.url;
    }

    return this.service.temporaryStorage(data, id, fileUrl);
  }

  // @Post('test')
  // @ApiOperation({ summary: '테스트 프로필 등록 API' })
  // async createTestProfile(
  //   @Body(new ValidationPipe()) data: CreateTestProfileDto,
  // ) {
  //   return this.service.createTestProfile(data);
  // }

  @Patch(':id')
  @ApiOperation({ summary: '프로필 수정 API' })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({
    name: 'id',
    required: true,
    description: '수정할 프로필 ID',
  })
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: UpdateProfileResDto,
  })
  async update(
    @Request() req,
    @Body(new ValidationPipe()) data: UpdateProfileDto,
    @Param('id') profileId: string,
  ) {
    const { id } = req.user.name;

    const { portfolioFile } = data;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    let fileUrl: string | null = null;

    if (portfolioFile) {
      const uploadedFile = await this.fileService.uploadFile(
        portfolioFile,
        id,
        EFileUsage.PROFILE,
      );
      fileUrl = uploadedFile.url;
    }

    return this.service.updateProfile(profileId, data, id, fileUrl);
  }

  @Delete(':id')
  @ApiOperation({ summary: '프로필 삭제 API' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '삭제할 프로필 ID',
  })
  @ApiResponse({
    status: 200,
    type: DeleteProfileResDto,
  })
  deleteUser(@Param('id') id: string) {
    return this.service.deleteProfile(id);
  }

  @Get('/all')
  @ApiOperation({
    summary:
      '프로필 전체 조회 API(내정보 페이지에서 사용)>프로필 제목/대표 프로필 여부 반환 + 임시저장 프로필까지 조회',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: GetProfileListResDto,
  })
  getAllProfile(@Request() req) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('user ID NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.getAllProfile(id);
  }

  @Get('/project')
  @ApiOperation({
    summary:
      '프로필 전체 조회 API(프로젝트 등록/수정페이지에서 사용)>프로필 제목/대표 프로필 여부 반환 + 임시저장 프로필 제외하고 조회',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: GetProfileListResDto,
  })
  getAllProfileForProject(@Request() req) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('user ID NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.getAllProfileForProject(id);
  }

  @Get('/exists')
  @ApiOperation({
    summary: '프로필 등록 여부 조회 API(프로젝트 등록 버튼 클릭시 사용)',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: GetProfileExistsResDto,
  })
  isProfileExists(@Request() req) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('user ID NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.isProfileExists(id);
  }

  @Get(':id')
  @ApiOperation({ summary: '프로필 상세 조회 API' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '조회할 프로필 ID',
  })
  @ApiResponse({
    status: 401,
    description: '존재하지 않는 사용자입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 프로필입니다.',
  })
  @ApiResponse({
    status: 200,
    type: GetOneProfileResDto,
  })
  getOneProject(@Param('id') id: string, @Request() req) {
    const { userId } = req.user.name;

    if (!userId) {
      throw new HttpException(
        '존재하지 않는 사용자입니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.service.getOneProfile(id);
  }
}
