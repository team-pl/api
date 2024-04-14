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
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  DeleteCommentResDto,
  GetCommentsResDto,
  PostCommentResDto,
  UpdateCommentResDto,
} from './dto/response.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
@ApiExtraModels(
  CreateCommentDto,
  PostCommentResDto,
  UpdateCommentResDto,
  DeleteCommentResDto,
  GetCommentsResDto,
)
@ApiTags('Comment')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Get()
  @ApiOperation({ summary: '댓글 조회 API>프로젝트 상세 조회시 호출' })
  @ApiQuery({
    name: 'projectId',
    required: true,
    description: '프로젝트 ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    type: GetCommentsResDto,
  })
  async getComment(@Query('projectId') projectId: string) {
    const data = await this.service.getComments(projectId);

    return { list: data };
  }

  @Post()
  @ApiOperation({ summary: '댓글 등록 API' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: PostCommentResDto,
  })
  async create(
    @Request() req,
    @Body(new ValidationPipe()) data: CreateCommentDto,
  ) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.create(data, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '댓글 수정 API' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '수정할 댓글 ID',
  })
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: UpdateCommentResDto,
  })
  async update(
    @Request() req,
    @Body(new ValidationPipe()) data: UpdateCommentDto,
    @Param('id') commentId: string,
  ) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.update(data, id, commentId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '댓글 삭제 API' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '삭제할 댓글 ID',
  })
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 403,
    description: '권한이 없어 이 댓글을 삭제할 수 없습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '이미 삭제되거나 존재하지 않는 댓글입니다.',
  })
  @ApiResponse({
    status: 200,
    type: DeleteCommentResDto,
  })
  async deleteMyComment(@Request() req, @Param('id') commentId: string) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('user ID NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.delete(id, commentId);
  }
}
