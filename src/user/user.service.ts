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
import { randomProfile } from 'src/lib/random-profile';
import { FileService } from 'src/file/file.service';
import { EFileUsage } from 'src/type/file.type';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly fileService: FileService,
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

    let url = profileImageUrl;

    // NOTE: 프로필 사진이 없을떄 랜덤 이미지로 설정
    if (!profileImageUrl) {
      url = randomProfile();
    }
    const user = await this.userRepository.create({
      id,
      kakaoId,
      name,
      phone: '',
      email,
      profileImageUrl: url,
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

    let url = profileImageUrl;

    // NOTE: 프로필 사진이 없을떄 랜덤 이미지로 설정
    if (!profileImageUrl) {
      url = randomProfile();
    }

    const user = await this.userRepository.create({
      id,
      naverId,
      name,
      phone,
      email,
      profileImageUrl: url,
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

  async getUserById(id: string): Promise<User> {
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

    if (!user) {
      throw new HttpException('user data NotFound', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(id, { ...data });

    const result = await this.userRepository.findOneBy({ id });

    return result;
  }

  // NOTE: 닉네임 중복체크 함수
  async nicknameDuplicateCheck(nickname: string) {
    const isSameNickname = await this.userRepository.exist({
      where: { nickname },
    });

    if (isSameNickname) {
      return false;
    }

    return true;
  }

  async getUserNicknameById(id: string) {
    const user = await this.userRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });

    return user.nickname;
  }

  async getMyInfo(id: string) {
    const user = await this.userRepository.findOne({
      where: { deletedAt: IsNull(), id },
      select: [
        'id',
        'profileImageUrl',
        'nickname',
        'signUpType',
        'jobType',
        'representativeProfileId',
      ],
      relations: ['profile'],
    });

    return user;
  }

  async updateProfile(id: string, data: UpdateProfileDto) {
    const { file, nickname, jobType } = data;

    let fileUrl: string | null = null;

    if (file) {
      const uploadedFile = await this.fileService.uploadFile(
        file,
        id,
        EFileUsage.DEFAULT,
      );
      fileUrl = uploadedFile.url;
    }

    if (fileUrl) {
      await this.userRepository.update(id, {
        profileImageUrl: fileUrl,
        nickname,
        jobType,
      });
    } else {
      await this.userRepository.update(id, {
        nickname,
        jobType,
      });
    }

    const user = await this.userRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
      select: ['id', 'profileImageUrl', 'nickname', 'jobType'],
    });

    return user;
  }
}
