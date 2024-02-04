import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entity/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { v4 as uuid } from 'uuid';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly profileService: ProfileService,
  ) {}

  async create(data: CreateProjectDto, userId: string, fileUrl: string | null) {
    const id = uuid();

    const { recruitExpiredAt, content, file, profileId, ...rest } = data;

    // NOTE: 모집마감일이 YYYY/MM/DD 형식의 string 으로 들어옴
    const [year, month, date] = recruitExpiredAt.split('/').map(Number);

    // NOTE: 사용자가 설정한 날짜의 23시 59분 59초까지로 모집마감일을 정함
    const expiredAt = new Date(year, month - 1, date, 23, 59, 59);

    const bufferContent = Buffer.from(content, 'utf-8');

    const profileData = await this.profileService.getProfileById(profileId);

    const project = await this.projectRepository.create({
      id,
      recruitExpiredAt: expiredAt,
      content: bufferContent,
      userId,
      file: fileUrl,
      ...rest,
    });

    const result = await this.projectRepository.save(project);

    return {
      ...result,
      content: result.content.toString(),
      profile: profileData,
    };
  }
}
