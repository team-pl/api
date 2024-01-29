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
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { FileService } from 'src/file/file.service';
import { SwaggerPostResponse } from 'src/decorator/swagger.decorator';
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
  @SwaggerPostResponse(PostProfileResDto)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Request() req,
    @Body(new ValidationPipe()) data: CreateProfileDto,
  ) {
    const { id } = req.user.name;

    const { portfolioFile } = data;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
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
