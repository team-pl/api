import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/entity/user.entity';
import { IsNull, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

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

  async signUp(data: CreateUserDto) {
    const id = uuid();
    const user = await this.userRepository.create({ id, ...data });
    return await this.userRepository.save(user);
  }

  async kakaoSignUp(
    kakaoId: string,
    name: string,
    email: string,
    profile: string,
  ) {
    const id = uuid();
    const user = await this.userRepository.create({
      id,
      kakaoId,
      name,
      phone: '',
      email,
      profile,
    });
    return await this.userRepository.save(user);
  }

  async naverSignUp(
    naverId: string,
    name: string,
    email: string,
    profile: string,
    phone: string = '',
  ) {
    const id = uuid();
    const user = await this.userRepository.create({
      id,
      naverId,
      name,
      phone,
      email,
      profile,
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

  async kakaoNextSignUp(id: string, phone: string, name: string) {
    const user = await this.userRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });

    if (!user) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

    return await this.userRepository.update(id, { phone, name });
  }
}
