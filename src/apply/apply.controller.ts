import {
  Body,
  Controller,
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
import { ApplyService } from './apply.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { CreateApplyDto } from './dto/create-apply.dto';
import {
  CancelApplyResDto,
  CheckApplyResDto,
  ConfirmApplyResDto,
  GetApplicantsResDto,
  GetDetailResDto,
  PostApplyResDto,
  RejectApplyResDto,
} from './dto/response.dto';
import { EGetApplyState } from 'src/type/apply.type';

@Controller('apply')
@ApiExtraModels(
  CreateApplyDto,
  PostApplyResDto,
  CheckApplyResDto,
  ConfirmApplyResDto,
  CancelApplyResDto,
  RejectApplyResDto,
  GetApplicantsResDto,
  GetDetailResDto,
)
@ApiTags('프로젝트 지원')
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
    status: 404,
    description: '존재하지 않는 프로젝트입니다.',
  })
  @ApiResponse({
    status: 409,
    description: '프로젝트 모집이 마감되어 지원이 불가능합니다.',
  })
  @ApiResponse({
    status: 422,
    description: '프로젝트에 이미 지원하여 중복지원이 불가능합니다.',
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
      throw new HttpException('user ID NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.create(data, id);
  }

  @Patch('check/:id')
  @ApiOperation({ summary: '프로젝트 확인완료 API' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '프로젝트 지원 ID',
  })
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 404,
    description: '프로젝트에 지원한 내역이 없습니다.',
  })
  @ApiResponse({
    status: 200,
    type: CheckApplyResDto,
  })
  async check(@Request() req, @Param('id') applyId: string) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.check(applyId);
  }

  @Patch('confirm/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: '프로젝트 지원 ID',
  })
  @ApiOperation({ summary: '프로젝트 참여확정 API' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 422,
    description: '해당 인원은 프로젝트에 이미 참여확정되었습니다.',
  })
  @ApiResponse({
    status: 200,
    type: ConfirmApplyResDto,
  })
  async confirm(@Request() req, @Param('id') applyId: string) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.confirm(applyId);
  }

  @Patch('cancel/:id')
  @ApiOperation({ summary: '프로젝트 확정취소 API' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '프로젝트 지원 ID',
  })
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 422,
    description: '해당 인원은 프로젝트에 이미 확정취소되었습니다.',
  })
  @ApiResponse({
    status: 200,
    type: CancelApplyResDto,
  })
  async cancel(@Request() req, @Param('id') applyId: string) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.cancel(applyId);
  }

  @Get()
  @ApiOperation({ summary: '프로젝트 지원자 목록 조회 API' })
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'state',
    required: true,
    description: '지원 상태',
    enum: EGetApplyState,
  })
  @ApiQuery({
    name: 'projectId',
    required: true,
    description: '프로젝트 ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    type: GetApplicantsResDto,
  })
  async getApplicantsList(
    @Request() req,
    @Query('state') state: EGetApplyState,
    @Query('projectId') projectId: string,
  ) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.getApplicantsList(projectId, state);
  }

  @Get(':id')
  @ApiOperation({ summary: '프로젝트 지원자 상세 조회 API' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '프로젝트 지원 ID',
  })
  @ApiResponse({
    status: 200,
    type: GetDetailResDto,
  })
  async getApplicant(@Request() req, @Param('id') applyId: string) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.getApplicant(applyId);
  }
}
