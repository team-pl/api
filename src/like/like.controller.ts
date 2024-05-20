import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LikeService } from './like.service';
import { ClickLikeDto } from './dto/click-like.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { LikeResDto, UnLikeResDto } from './dto/response.dto';

@Controller('like')
@ApiExtraModels(ClickLikeDto, LikeResDto, UnLikeResDto)
@ApiTags('좋아요(찜)')
export class LikeController {
  constructor(private readonly service: LikeService) {}

  @Post()
  @ApiOperation({ summary: '좋아요(찜) 클릭 API' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: LikeResDto,
  })
  async likeProject(
    @Request() req,
    @Body(new ValidationPipe()) data: ClickLikeDto,
  ) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return await this.service.likeProject(data, id);
  }

  @Delete(':projectId')
  @ApiOperation({ summary: '좋아요(찜) 해지 API' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'projectId',
    required: true,
    description: '좋아요 해지할 프로젝트 ID',
  })
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: UnLikeResDto,
  })
  deleteUser(@Request() req, @Param('projectId') projectId: string) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.unlikeProject(projectId, id);
  }
}
