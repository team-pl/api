import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apply } from 'src/entity/apply.entity';
import { Repository } from 'typeorm';
import { CreateApplyDto } from './dto/create-apply.dto';
import { v4 as uuid } from 'uuid';
import { ProjectService } from 'src/project/project.service';
import { NotificationsService } from 'src/notification/notification.service';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(Apply)
    private applyRepository: Repository<Apply>,
    private readonly projectService: ProjectService,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(data: CreateApplyDto, userId: string) {
    const id = uuid();

    const { projectId, profileId, details } = data;

    // NOTE: 지원하려는 프로젝트 정보 조회
    const { projectUserId, name, applicantTotalNumber } =
      await this.projectService.applyProject(projectId, userId);

    // NOTE: 프로젝트 모집한 사람에게 알림 보내기
    await this.notificationService.create({
      userId: projectUserId,
      projectId,
      message: `${name} 프로젝트에 새로운 지원자가 ${applicantTotalNumber}명 있습니다.`,
    });

    const applyData = await this.applyRepository.create({
      id,
      projectId,
      profileId,
      userId,
      details,
    });

    await this.applyRepository.save(applyData);

    return applyData;
  }
}
