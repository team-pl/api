import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entity/profile.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(data: CreateProfileDto, userId: string, fileUrl: string | null) {
    const id = uuid();

    const { portfolioFile, ...rest } = data;

    const project = await this.profileRepository.create({
      id,
      userId,
      portfolioFile: fileUrl,
      ...rest,
    });

    return await this.profileRepository.save(project);
  }

  async getProfileById(id: string) {
    const profileData = await this.profileRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });

    if (!profileData) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

    return profileData;
  }
}
