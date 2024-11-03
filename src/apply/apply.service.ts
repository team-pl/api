import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apply } from 'src/entity/apply.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
import { CreateApplyDto } from './dto/create-apply.dto';
import { v4 as uuid } from 'uuid';
import { ProjectService } from 'src/project/project.service';
import { NotificationsService } from 'src/notification/notification.service';
import { EApplyState, EGetApplyState } from 'src/type/apply.type';
import { EDashboardState } from 'src/type/notification.type';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(Apply)
    private applyRepository: Repository<Apply>,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(data: CreateApplyDto, userId: string) {
    const id = uuid();

    const { projectId, profileId, details } = data;

    // NOTE: 중복 지원 방지를 위해서 기존에 해당 프로젝트에 지원했는지 확인
    const prevApplyData = await this.applyRepository.findOneBy({
      deletedAt: IsNull(),
      userId,
      projectId,
    });

    if (prevApplyData) {
      throw new HttpException(
        '프로젝트에 이미 지원하여 중복지원이 불가능합니다.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // NOTE: 지원하려는 프로젝트 정보 조회
    const {
      projectUserId,
      name,
      applicantTotalNumber,
      profileImageUrl,
      nickname,
      jobType,
    } = await this.projectService.applyProject(projectId, userId);

    // NOTE: 지원 데이터 생성
    const applyData = await this.applyRepository.create({
      id,
      projectId,
      userId,
      profileId,
      details,
      profileImageUrl,
      nickname,
      jobType,
    });

    await this.applyRepository.save(applyData);

    // NOTE: 프로젝트 모집한 사람에게 알림 보내기
    await this.notificationService.createForApply({
      userId: projectUserId,
      message: `프로젝트에 새로운 지원자가 ${applicantTotalNumber}명 있습니다.`,
      projectId,
      projectName: name,
      targetPage: 'dashboard',
      dashboardState: EDashboardState.REGISTER,
    });

    // NOTE: 프로젝트 지원한 사람에게 알림 보내기
    await this.notificationService.createForApply({
      userId,
      message: '프로젝트 지원완료가 되었습니다.',
      projectId,
      projectName: name,
      targetPage: 'dashboard',
      dashboardState: EDashboardState.APPLY,
    });

    return {
      id: applyData.id,
    };
  }

  // NOTE: 지원확인 API 로직
  async check(applyId: string, userId: string) {
    const applyData = await this.applyRepository.findOneBy({ id: applyId });

    // NOTE: 프로젝트 지원한 내역이 없을때
    if (!applyData) {
      throw new HttpException(
        '프로젝트에 지원한 내역이 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    // NOTE: 프로젝트 조회
    const { name, projectUserId } = await this.projectService.checkApply(
      applyData.projectId,
    );

    // NOTE: 프로젝트 지원 상태 변경을 요청한 사용자와 프로젝트 등록한 사용자가 다른 경우
    if (projectUserId !== userId) {
      throw new HttpException(
        '프로젝트 등록한 사람만 지원상태를 변경할 수 있습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    // NOTE: 지원 상태 업데이트
    await this.applyRepository.update(
      { id: applyId },
      { state: EApplyState.CHECKED },
    );

    // NOTE: 지원한 사람에게 알림 보내기
    await this.notificationService.createForApply({
      userId: applyData.userId,
      message: '프로젝트의 지원서가 열람되었습니다.',
      projectId: applyData.projectId,
      projectName: name,
      targetPage: 'dashboard',
      dashboardState: EDashboardState.APPLY,
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

  async getApplicantsList(
    projectId: string,
    state: EGetApplyState = EGetApplyState.ALL,
  ) {
    const list = [];

    if (state === EGetApplyState.ALL) {
      const data = await this.applyRepository.find({
        where: {
          deletedAt: IsNull(),
          projectId,
        },
        order: {
          createdAt: 'DESC',
        },
        select: [
          'id',
          'createdAt',
          'nickname',
          'profileImageUrl',
          'jobType',
          'state',
          'userId',
          'profileId',
        ],
      });
      list.push(...data);
    } else {
      const data = await this.applyRepository.find({
        where: {
          deletedAt: IsNull(),
          state: In([state]),
          projectId,
        },
        order: {
          createdAt: 'DESC',
        },
        select: [
          'id',
          'createdAt',
          'nickname',
          'profileImageUrl',
          'jobType',
          'state',
          'userId',
          'profileId',
        ],
      });
      list.push(...data);
    }

    return {
      list,
      count: list.length,
    };
  }

  async getApplicant(applyId: string) {
    const applyData = await this.applyRepository.findOneBy({
      deletedAt: IsNull(),
      id: applyId,
    });

    const profileData = await this.projectService.getApplicant(
      applyData.profileId,
    );

    const eduArray = [];
    const careerArray = [];

    for (let i = 1; i <= 5; i++) {
      if (!profileData[`eduCategory${i}`]) break;

      eduArray.push({
        category: profileData[`eduCategory${i}`],
        schoolName: profileData[`eduSchoolName${i}`],
        major: profileData[`eduMajor${i}`],
        admissionDate: profileData[`eduAdmissionDate${i}`],
        graduationDate: profileData[`eduGraduationDate${i}`],
        isAttending: profileData[`eduIsAttending${i}`],
      });
    }

    for (let i = 1; i <= 10; i++) {
      if (!profileData[`careerCompanyName${i}`]) break;

      careerArray.push({
        companyName: profileData[`careerCompanyName${i}`],
        role: profileData[`careerRole${i}`],
        joinDate: profileData[`careerJoinDate${i}`],
        quitDate: profileData[`careerQuitDate${i}`],
        isWorking: profileData[`careerIsWorking${i}`],
      });
    }

    return {
      details: applyData.details,
      profile: {
        id: profileData.id,
        createdAt: profileData.createdAt,
        name: profileData.name,
        edu: eduArray,
        carrer: careerArray,
        skill: profileData.skill.split('&&'),
        portfolioUrl: profileData.portfolioUrl,
        portfolioFile: profileData.portfolioFile,
      },
    };
  }

  // NOTE: 사용자별 지원완료한 목록 조회
  async getUserApplyList(userId: string): Promise<string[]> {
    const dataList = await this.applyRepository.findBy({
      deletedAt: IsNull(),
      userId,
      state: In([EApplyState.UNCONFIRMED, EApplyState.CHECKED]),
    });

    const result = dataList.map((data) => data.projectId);

    return result;
  }

  // NOTE: 사용자별 침야확정한 목록 조회
  async getUserConfirmedList(userId: string): Promise<string[]> {
    const dataList = await this.applyRepository.findBy({
      deletedAt: IsNull(),
      userId,
      state: In([EApplyState.CONFIRMED, EApplyState.CONFIRMED_CANCELED]),
    });

    const result = dataList.map((data) => data.projectId);

    return result;
  }

  async getIsApplied({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: string;
  }) {
    const applyData = await this.applyRepository.findOneBy({
      deletedAt: IsNull(),
      userId,
      projectId,
    });

    return applyData ? true : false;
  }
}
