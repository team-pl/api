import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
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
import { ProfileService } from './profile.service';
import { FileService } from 'src/file/file.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileDto } from './dto/create-profile.dto';
import { EFileUsage } from 'src/type/file.type';
import { PostProfileResDto } from './dto/response.dto';

@Controller('profile')
@ApiExtraModels(CreateProfileDto, PostProfileResDto)
@ApiTags('Profile')
export class ProfileController {
  constructor(
    private readonly service: ProfileService,
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
}
