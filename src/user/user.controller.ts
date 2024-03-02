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
  Put,
  Request,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import {
  GetUserResDto,
  NicknameDuplicateResDto,
  PostUserResDto,
  UpdateProfileResDto,
} from './dto/response.dto';
import {
  SwaggerGetListResponse,
  SwaggerGetResponse,
} from 'src/decorator/swagger.decorator';
import { SignupUserDto } from './dto/signup-user.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { NicknameDuplicateDto } from './dto/nickname-duplicate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDto } from './dto/update-profile.dto';

@Controller('user')
@ApiExtraModels(
  GetUserResDto,
  PostUserResDto,
  NicknameDuplicateDto,
  NicknameDuplicateResDto,
  UpdateUserProfileDto,
  UpdateProfileResDto,
)
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @SwaggerGetListResponse(GetUserResDto)
  @Get()
  // @ApiOperation({ summary: '사용자 전체 조회 API' })
  getAllUsers() {
    return this.service.getAllUser();
  }

  // NOTE: 닉네임 중복체크 API
  @Post('nickname-check')
  @ApiOperation({ summary: '닉네임 중복체크 API' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: NicknameDuplicateResDto,
  })
  nicknameDuplicateCheck(
    @Request() req,
    @Body(new ValidationPipe()) data: NicknameDuplicateDto,
  ) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }

    const { nickname } = data;

    return this.service.nicknameDuplicateCheck(nickname);
  }

  @Patch('profile')
  @ApiOperation({
    summary: '내정보 페이지>프로필 사진/닉네임/직책 및 전공 수정 API',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 200,
    type: UpdateProfileResDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  updateProfile(
    @Request() req,
    @Body(new ValidationPipe()) data: UpdateUserProfileDto,
  ) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('user ID NotFound', HttpStatus.UNAUTHORIZED);
    }

    return this.service.updateProfile(id, data);
  }

  @SwaggerGetResponse(GetUserResDto)
  @Get(':id')
  getOneUser(@Param('id') id: string) {
    return this.service.getUser(id);
  }

  @Patch('/signup')
  @ApiOperation({
    summary: '회원가입 API',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 401,
    description: 'user ID NotFound',
  })
  @ApiResponse({
    status: 404,
    description: 'user data NotFound',
  })
  @ApiResponse({
    status: 200,
    type: GetUserResDto,
  })
  signUp(@Request() req, @Body(new ValidationPipe()) data: SignupUserDto) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.UNAUTHORIZED);
    }
    return this.service.signUp(id, data);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) data: UpdateUserDto,
  ) {
    return this.service.updateUser(id, data);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }
}
