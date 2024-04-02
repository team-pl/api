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
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  DeleteCommentResDto,
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
)
@ApiTags('Comment')
export class CommentController {
  constructor(private readonly service: CommentService) {}

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
    status: 200,
    type: DeleteCommentResDto,
  })
  async deleteMyComment(@Request() req, @Param('id') commentId: string) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.delete(id, commentId);
  }
}
