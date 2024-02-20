import {
  Body,
  Controller,
  Delete,
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
  PostProfileResDto,
  UpdateProfileResDto,
} from './dto/response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
@ApiExtraModels(
  CreateProfileDto,
  PostProfileResDto,
  DeleteProfileResDto,
  UpdateProfileDto,
  UpdateProfileResDto,
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
}
