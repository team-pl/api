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
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApplyService } from './apply.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { CreateApplyDto } from './dto/create-apply.dto';
import { PostApplyResDto } from './dto/response.dto';

@Controller('apply')
@ApiExtraModels(CreateApplyDto, PostApplyResDto)
@ApiTags('Apply')
export class ApplyController {
  constructor(private readonly service: ApplyService) {}

  @Post()
  @ApiOperation({ summary: '프로젝트 지원 등록 API' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: PostApplyResDto,
  })
  async create(
    @Request() req,
    @Body(new ValidationPipe()) data: CreateApplyDto,
  ) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.create(data, id);
  }
}
