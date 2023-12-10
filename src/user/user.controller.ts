import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { GetUserResDto, PostUserResDto } from './dto/response.dto';
import {
  SwaggerGetListResponse,
  SwaggerGetResponse,
  SwaggerPostResponse,
} from 'src/decorator/swagger.decorator';

@Controller('user')
@ApiExtraModels(GetUserResDto, PostUserResDto)
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @SwaggerGetListResponse(GetUserResDto)
  @Get()
  getAllUsers() {
    console.log('/GET API ');
    return this.service.getAllUser();
  }

  @SwaggerGetResponse(GetUserResDto)
  @Get(':id')
  getOneUser(@Param('id') id: string) {
    return this.service.getUser(id);
  }

  @SwaggerPostResponse(PostUserResDto)
  @Post()
  signUp(@Body(new ValidationPipe()) data: CreateUserDto) {
    return this.service.signUp(data);
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
