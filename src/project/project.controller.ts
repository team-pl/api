import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { SwaggerPostResponse } from 'src/decorator/swagger.decorator';
import { PostProjectResDto } from './dto/response.dto';

@Controller('project')
@ApiExtraModels(CreateProjectDto, PostProjectResDto)
@ApiTags('Project')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @SwaggerPostResponse(PostProjectResDto)
  @Post()
  create(@Body(new ValidationPipe()) data: CreateProjectDto) {
    return this.service.create(data);
  }
}
