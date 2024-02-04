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
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import {
  GetUserResDto,
  NicknameDuplicateResDto,
  PostUserResDto,
} from './dto/response.dto';
import {
  SwaggerGetListResponse,
  SwaggerGetResponse,
  SwaggerPostResponse,
} from 'src/decorator/swagger.decorator';
import { SignupUserDto } from './dto/signup-user.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { NicknameDuplicateDto } from './dto/nickname-duplicate.dto';

@Controller('user')
@ApiExtraModels(
  GetUserResDto,
  PostUserResDto,
  NicknameDuplicateDto,
  NicknameDuplicateResDto,
)
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @SwaggerGetListResponse(GetUserResDto)
  @Get()
  getAllUsers() {
    console.log('/GET API ');
    return this.service.getAllUser();
  }

  // NOTE: 닉네임 중복체크 API
  @Post('nickname-check')
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

  @SwaggerGetResponse(GetUserResDto)
  @Get(':id')
  getOneUser(@Param('id') id: string) {
    return this.service.getUser(id);
  }

  @Patch('/signup')
  @UseGuards(JwtAuthGuard)
  signUp(@Request() req, @Body(new ValidationPipe()) data: SignupUserDto) {
    const { id } = req.user.name;

    if (!id) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
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
