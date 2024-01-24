import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entity/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(data: CreateProjectDto, userId: string, fileUrl: string | null) {
    const id = uuid();

    const { recruitExpiredAt, content, file, ...rest } = data;

    const [year, month, date] = recruitExpiredAt.split('-').map(Number);

    const expiredAt = new Date(year, month - 1, date, 23, 59, 59);

    const bufferContent = Buffer.from(content, 'utf-8');

    const project = await this.projectRepository.create({
      id,
      recruitExpiredAt: expiredAt,
      content: bufferContent,
      userId,
      file: fileUrl,
      ...rest,
    });

    return await this.projectRepository.save(project);
  }
}
