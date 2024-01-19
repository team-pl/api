import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { SwaggerPostResponse } from 'src/decorator/swagger.decorator';
import { PostProjectResDto } from './dto/response.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@Controller('project')
@ApiExtraModels(CreateProjectDto, PostProjectResDto)
@ApiTags('Project')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @SwaggerPostResponse(PostProjectResDto)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body(new ValidationPipe()) data: CreateProjectDto) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    }

    return this.service.create(data, id);
  }
}
