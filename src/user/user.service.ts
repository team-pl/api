import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
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

  async createUser(data: CreateUserDto) {
    const id = uuid();
    const user = await this.userRepository.create({ id, ...data });
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
}
