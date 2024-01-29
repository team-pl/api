import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entity/profile.entity';
import { Repository } from 'typeorm';
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
}
