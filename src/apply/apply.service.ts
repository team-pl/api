import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apply } from 'src/entity/apply.entity';
import { Repository } from 'typeorm';
import { CreateApplyDto } from './dto/create-apply.dto';
import { v4 as uuid } from 'uuid';
import { ProjectService } from 'src/project/project.service';
import { NotificationsService } from 'src/notification/notification.service';
import { EApplyState } from 'src/type/apply.type';

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

    // NOTE: 중복 지원 방지를 위해서 기존에 해당 프로젝트에 지원했는지 확인
    const applyArr = await this.applyRepository.findBy({ userId, projectId });

    if (applyArr.length) {
      throw new HttpException(
        '프로젝트에 이미 지원하여 중복지원이 불가능합니다.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // NOTE: 지원하려는 프로젝트 정보 조회
    const { projectUserId, name, applicantTotalNumber } =
      await this.projectService.applyProject(projectId, userId);

    // NOTE: 프로젝트 모집한 사람에게 알림 보내기
    await this.notificationService.create({
      userId: projectUserId,
      projectId,
      message: `프로젝트에 새로운 지원자가 ${applicantTotalNumber}명 있습니다.`,
      projectName: name,
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

  // NOTE: 확인 API 로직
  async check(applyId: string) {
    const applyData = await this.applyRepository.findOneBy({ id: applyId });

    // NOTE: 프로젝트 지원한 내역이 없을때
    if (!applyData) {
      throw new HttpException(
        '프로젝트에 지원한 내역이 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    // NOTE: 지원 상태 업데이트
    await this.applyRepository.update(
      { id: applyId },
      { state: EApplyState.CHECKED },
    );

    const { name } = await this.projectService.checkApply(applyData.projectId);

    // NOTE: 프로젝트 지원한 사람에게 알림 보내기
    await this.notificationService.create({
      userId: applyData.userId,
      projectId: applyData.projectId,
      message: `프로젝트 지원결과가 업데이트 되었습니다.`,
      projectName: name,
    });

    return { result: true };
  }

  // NOTE: 참여확정 API 로직
  async confirm(applyId: string) {
    const applyData = await this.applyRepository.findOneBy({ id: applyId });

    // NOTE: 프로젝트 지원한 내역이 없을때
    if (!applyData) {
      throw new HttpException(
        '프로젝트에 지원한 내역이 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    // NOTE: 이미 프로젝트 참여 확정 상태인 경우
    if (applyData.state === EApplyState.CONFIRMED) {
      throw new HttpException(
        '해당 인원은 프로젝트에 이미 참여확정되었습니다.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const { name } = await this.projectService.confirmedProject(
      applyData.projectId,
      applyData.userId,
    );

    // NOTE: 지원 상태 업데이트
    await this.applyRepository.update(
      { id: applyId },
      { state: EApplyState.CONFIRMED },
    );

    console.log('name: ', name);

    // NOTE: 프로젝트 지원한 사람에게 알림 보내기
    await this.notificationService.create({
      userId: applyData.userId,
      projectId: applyData.projectId,
      message: `프로젝트 지원결과가 업데이트 되었습니다.`,
      projectName: name,
    });

    return { result: true };
  }

  // NOTE: 확정취소 API 로직
  async cancel(applyId: string) {
    const applyData = await this.applyRepository.findOneBy({ id: applyId });

    // NOTE: 프로젝트 지원한 내역이 없을때
    if (!applyData) {
      throw new HttpException(
        '프로젝트에 지원한 내역이 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    // NOTE: 이미 프로젝트 확정취소 상태인 경우
    if (applyData.state === EApplyState.CONFIRMED_CANCELED) {
      throw new HttpException(
        '해당 인원은 프로젝트에 이미 확정취소되었습니다.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const { name } = await this.projectService.cancelApply(
      applyData.projectId,
      applyData.state,
    );

    // NOTE: 지원 상태 업데이트
    await this.applyRepository.update(
      { id: applyId },
      { state: EApplyState.CONFIRMED_CANCELED },
    );

    // NOTE: 프로젝트 지원한 사람에게 알림 보내기
    await this.notificationService.create({
      userId: applyData.userId,
      projectId: applyData.projectId,
      message: `프로젝트 지원결과가 업데이트 되었습니다.`,
      projectName: name,
    });

    return { result: true };
  }

  async reject(applyId: string) {
    const applyData = await this.applyRepository.findOneBy({ id: applyId });

    // NOTE: 프로젝트 지원한 내역이 없을때
    if (!applyData) {
      throw new HttpException(
        '프로젝트에 지원한 내역이 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    // NOTE: 이미 프로젝트 거절 상태인 경우
    if (applyData.state === EApplyState.REJECT_CONFIRMED) {
      throw new HttpException(
        '해당 인원은 프로젝트에 이미 거절되었습니다.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const { name } = await this.projectService.rejectApply(
      applyData.projectId,
      applyData.state,
    );

    // NOTE: 지원 상태 업데이트
    await this.applyRepository.update(
      { id: applyId },
      { state: EApplyState.REJECT_CONFIRMED },
    );

    // NOTE: 프로젝트 지원한 사람에게 알림 보내기
    await this.notificationService.create({
      userId: applyData.userId,
      projectId: applyData.projectId,
      message: `프로젝트 지원결과가 업데이트 되었습니다.`,
      projectName: name,
    });

    return { result: true };
  }
}
