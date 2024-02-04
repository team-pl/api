import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/entity/user.entity';
import { IsNull, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ESignUp } from 'src/type/user.type';
import { SignupUserDto } from './dto/signup-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUser() {
    return await this.userRepository.find({
      where: {
        deletedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getUser(id: string) {
    const user = await this.getUserById(id);

    if (!user) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

    return this.getUserById(id);
  }

  async kakaoSignUp(
    kakaoId: string,
    name: string,
    email: string,
    profileImageUrl: string,
  ) {
    const id = uuid();
    const user = await this.userRepository.create({
      id,
      kakaoId,
      name,
      phone: '',
      email,
      profileImageUrl,
      signUpType: ESignUp.KAKAO,
    });
    return await this.userRepository.save(user);
  }

  async naverSignUp(
    naverId: string,
    name: string,
    email: string,
    profileImageUrl: string,
    phone: string = '',
  ) {
    const id = uuid();
    const user = await this.userRepository.create({
      id,
      naverId,
      name,
      phone,
      email,
      profileImageUrl,
      signUpType: ESignUp.NAVER,
    });
    return await this.userRepository.save(user);
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.getUserById(id);

    if (!user) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

    return await this.userRepository.update(id, { ...data });
  }

  async deleteUser(id: string) {
    const now = new Date();
    const user = await this.getUserById(id);

    if (!user) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

    return await this.userRepository.update(id, { deletedAt: now });
  }

  async getUserById(id: string) {
    return await this.userRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });
  }

  async findUser(name: string, id: string) {
    const user = await this.userRepository.findOneBy({
      name,
      id,
      deletedAt: IsNull(),
    });

    if (!user) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

    return user;
  }

  async getUserByKakaoId(id: string) {
    return await this.userRepository.findOneBy({
      kakaoId: id,
      deletedAt: IsNull(),
    });
  }

  async getUserByNaverId(id: string) {
    return await this.userRepository.findOneBy({
      naverId: id,
      deletedAt: IsNull(),
    });
  }

  async setRefreshToken(id: string, token: string) {
    this.userRepository.update(id, { refreshToken: token });
  }

  async signUp(id: string, data: SignupUserDto) {
    const user = await this.userRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });

    if (!user) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

    return await this.userRepository.update(id, { ...data });
  }

  // NOTE: 닉네임 중복체크 함수
  async nicknameDuplicateCheck(nickname: string) {
    const isSameNickname = await this.userRepository.exist({
      where: { nickname },
    });

    if (isSameNickname) {
      throw new UnauthorizedException('해당 닉네임이 이미 존재합니다.');
    }

    return true;
  }
}
