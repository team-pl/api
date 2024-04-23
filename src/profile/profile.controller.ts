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
  GetMyInfoResDto,
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
  GetMyInfoResDto,
  CreateProfileTempDto,
  PostTempProfileResDto,
  CreateTestProfileDto,
)
@ApiTags('Profile')
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
    description: 'Number of profile registrations exceeded',
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
    description: 'Number of profile registrations exceeded',
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

  @Get('/myInfo')
  @ApiOperation({
    summary: '내정보 페이지>조회 API',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: GetMyInfoResDto,
  })
  getMyInfo(@Request() req) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('user ID NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.getAllProfile(id);
  }
}
