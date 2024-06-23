import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entity/project.entity';
import { In, IsNull, Like, Raw, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { v4 as uuid } from 'uuid';
import { ProfileService } from 'src/profile/profile.service';
import {
  ECategory1,
  ECategory2,
  ECategorySelect,
  EProjectState,
  ESortDirection,
  ESubCategorySelect,
} from 'src/type/project.type';
import { UserService } from 'src/user/user.service';
import { GetProjectQueryDto } from './dto/get-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { EApplyState } from 'src/type/apply.type';
import { LikeService } from 'src/like/like.service';
import { GetDashboardProjectsQueryDto } from './dto/get-dashboard-project';
import { ApplyService } from 'src/apply/apply.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => LikeService))
    private readonly likeService: LikeService,
    @Inject(forwardRef(() => ApplyService))
    private readonly applyService: ApplyService,
  ) {}

  async create(data: CreateProjectDto, userId: string, fileUrl: string | null) {
    let devCount = 0;
    let designCount = 0;
    let etcCount = 0;
    const category: ECategory1[] = [];
    const subCategory: ECategory2[] = [];

    const id = uuid();

    const {
      recruitExpiredAt,
      content,
      file,
      profileId,
      categoryInfo,
      ...rest
    } = data;

    // NOTE: 모집마감일이 YYYY/MM/DD 형식의 string 으로 들어옴
    const [year, month, date] = recruitExpiredAt.split('/').map(Number);

    // NOTE: 사용자가 설정한 날짜의 23시 59분 59초까지로 모집마감일을 정함
    const expiredAt = new Date(year, month - 1, date, 23, 59, 59);

    const bufferContent = Buffer.from(content, 'utf-8');

    const profileData = await this.profileService.getProfileById(profileId);

    const userNickname = await this.userService.getUserNicknameById(userId);

    const categoryData = {};

    categoryInfo?.map((data, index) => {
      subCategory.push(data.subCategory);

      categoryData[`category${index + 1}_1`] = data.category;
      categoryData[`category${index + 1}_2`] = data.subCategory;
      categoryData[`category${index + 1}Number`] = data.count;

      if (data.category === ECategory1.DEVELOPER) {
        devCount += data.count;
      } else if (data.category === ECategory1.DESIGN) {
        designCount += data.count;
      } else {
        etcCount += data.count;
      }
    });

    if (devCount > 0) {
      category.push(ECategory1.DEVELOPER);
    }

    if (designCount > 0) {
      category.push(ECategory1.DESIGN);
    }

    if (etcCount > 0) {
      category.push(ECategory1.ETC);
    }

    const project = await this.projectRepository.create({
      id,
      recruitExpiredAt: expiredAt,
      content: bufferContent,
      userId,
      file: fileUrl,
      profileId,
      recruitDevTotalNumber: devCount,
      recruitDesignTotalNumber: designCount,
      recruitEtcTotalNumber: etcCount,
      recruitCategory: category.join('/'),
      recruitSubCategory: subCategory.join('/'),
      userName: userNickname,
      ...categoryData,
      ...rest,
    });

    const result = await this.projectRepository.save(project);

    return {
      id: result.id,
      createdAt: result.createdAt,
      name: result.name,
      state: result.state,
      recruitExpiredAt: result.recruitExpiredAt,
      recruitTotalNumber: result.recruitTotalNumber,
      confirmedNumber: result.confirmedNumber,
      recruitDevTotalNumber: result.recruitDevTotalNumber,
      recruitDesignTotalNumber: result.recruitDesignTotalNumber,
      recruitEtcTotalNumber: result.recruitEtcTotalNumber,
      recruitCategory: category,
      recruitSubCategory: subCategory,
      userName: result.userName,
      numberOfViews: result.numberOfViews,
      numberOfLikes: result.numberOfLikes,
      content: result.content.toString(),
      url: result.url,
      file: result.file,
      profile: profileData,
      userId: result.userId,
      categoryInfo,
    };
  }

  async getHomeProject(userId?: string) {
    // NOTE: 인기 점수 내림차순으로 프로젝트 8개를 가져옴
    const popularList = await this.projectRepository.findAndCount({
      // NOTE: 현재 프로젝트 상태가 모집중이거나 기한이 남았지만 모집인원이 다 차서 마감된 모집 종료 상태일때 SELECT 해옴
      where: {
        deletedAt: IsNull(),
        state: In([EProjectState.RECRUITING, EProjectState.END]),
      },
      take: 8,
      order: { numberOfScore: 'DESC' },
      select: [
        'id',
        'createdAt',
        'name',
        'content',
        'state',
        'recruitCategory',
        'recruitTotalNumber',
        'confirmedNumber',
        'userName',
        'recruitExpiredAt',
      ],
    });

    const finalPopularList = popularList[0].map(async (data) => {
      let isLike = false;
      if (userId) {
        isLike = await this.likeService.getProjectUserLike(data.id, userId);
      }

      return {
        ...data,
        recruitCategory: data.recruitCategory.split('/'),
        content: data.content.toString(),
        isLike: isLike,
      };
    });

    // NOTE: 프로젝트 생성일 내림차순으로 프로젝트 8개를 가져옴
    const newList = await this.projectRepository.findAndCount({
      // NOTE: 현재 프로젝트 상태가 모집중이거나 기한이 남았지만 모집인원이 다 차서 마감된 모집 종료 상태일때 SELECT 해옴
      where: {
        deletedAt: IsNull(),
        state: In([EProjectState.RECRUITING, EProjectState.END]),
      },
      take: 8,
      select: [
        'id',
        'createdAt',
        'name',
        'content',
        'state',
        'recruitCategory',
        'recruitTotalNumber',
        'confirmedNumber',
        'userName',
        'recruitExpiredAt',
      ],
      order: { createdAt: 'DESC' },
    });

    const finalNewList = newList[0].map(async (data) => {
      let isLike = false;
      if (userId) {
        isLike = await this.likeService.getProjectUserLike(data.id, userId);
      }

      return {
        ...data,
        recruitCategory: data.recruitCategory.split('/'),
        content: data.content.toString(),
        isLike: isLike,
      };
    });

    const resolvedFinalPopularList = await Promise.all(finalPopularList);
    const resolvedFinalNewList = await Promise.all(finalNewList);

    return {
      popular: resolvedFinalPopularList,
      new: resolvedFinalNewList,
    };
  }

  async getProjectList({ ...query }: GetProjectQueryDto) {
    const {
      skip,
      take = '12',
      category = ECategorySelect.ALL,
      subCategory = ESubCategorySelect.ALL,
      searchWord = '',
      userId = '',
      sort = '',
    } = query;

    const transCategory = category === ECategorySelect.ALL ? '' : category;

    const transSubCategory =
      subCategory === ESubCategorySelect.ALL ? '' : subCategory;

    let orderBy = {};

    switch (sort) {
      case ESortDirection.POPULAR:
        orderBy = { numberOfScore: 'DESC' };
        break;
      case ESortDirection.LATEST:
        orderBy = { createdAt: 'DESC' };
        break;
      default:
        orderBy = { createdAt: 'DESC' };
    }

    // NOTE: 최신순으로 프로젝트 조회
    const list = await this.projectRepository.findAndCount({
      where: [
        {
          deletedAt: IsNull(),
          recruitCategory: Like(`%${transCategory}%`),
          recruitSubCategory: Like(`%${transSubCategory}%`),
          name: Like(`%${searchWord}%`),
        },
        {
          deletedAt: IsNull(),
          recruitCategory: Like(`%${transCategory}%`),
          recruitSubCategory: Like(`%${transSubCategory}%`),
          userName: Like(`%${searchWord}%`),
        },
        {
          deletedAt: IsNull(),
          recruitCategory: Like(`%${transCategory}%`),
          recruitSubCategory: Like(`%${transSubCategory}%`),
          content: Raw(
            (data) => `ENCODE(${data}, 'escape') LIKE '%${searchWord}%'`,
          ),
        },
      ],
      skip: Number(skip),
      take: Number(take),
      order: orderBy,
      select: [
        'id',
        'createdAt',
        'name',
        'content',
        'state',
        'recruitCategory',
        'recruitTotalNumber',
        'confirmedNumber',
        'userName',
        'recruitExpiredAt',
      ],
    });

    const finalList = list[0].map(async (data) => {
      let isLike = false;
      if (userId) {
        isLike = await this.likeService.getProjectUserLike(data.id, userId);
      }

      return {
        ...data,
        recruitCategory: data.recruitCategory.split('/'),
        content: data.content.toString(),
        isLike,
      };
    });

    const resolvedFinalList = await Promise.all(finalList);

    return { list: resolvedFinalList, count: list[1] };
  }

  async getProjectById(id: string) {
    const projectData = await this.projectRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });

    if (!projectData)
      throw new HttpException('Project NotFound', HttpStatus.NOT_FOUND);

    return projectData;
  }

  async updateProject(
    projectId: string,
    data: UpdateProjectDto,
    fileUrl: string | null,
  ) {
    let devCount = 0;
    let designCount = 0;
    let etcCount = 0;

    const category: ECategory1[] = [];
    const subCategory: ECategory2[] = [];

    const {
      recruitExpiredAt,
      content,
      file,
      profileId,
      categoryInfo,
      ...rest
    } = data;

    // NOTE: 모집마감일이 YYYY/MM/DD 형식의 string 으로 들어옴
    const [year, month, date] = recruitExpiredAt.split('/').map(Number);

    // NOTE: 사용자가 설정한 날짜의 23시 59분 59초까지로 모집마감일을 정함
    const expiredAt = new Date(year, month - 1, date, 23, 59, 59);

    const bufferContent = Buffer.from(content, 'utf-8');

    const profileData = await this.profileService.getProfileById(profileId);

    const categoryData = {};

    categoryInfo?.map((data, index) => {
      subCategory.push(data.subCategory);

      categoryData[`category${index + 1}_1`] = data.category;
      categoryData[`category${index + 1}_2`] = data.subCategory;
      categoryData[`category${index + 1}Number`] = data.count;

      if (data.category === ECategory1.DEVELOPER) {
        devCount += data.count;
      } else if (data.category === ECategory1.DESIGN) {
        designCount += data.count;
      } else {
        etcCount += data.count;
      }
    });

    if (devCount > 0) {
      category.push(ECategory1.DEVELOPER);
    }

    if (designCount > 0) {
      category.push(ECategory1.DESIGN);
    }

    if (etcCount > 0) {
      category.push(ECategory1.ETC);
    }

    await this.projectRepository.update(projectId, {
      recruitExpiredAt: expiredAt,
      content: bufferContent,
      file: fileUrl,
      profileId,
      recruitDevTotalNumber: devCount,
      recruitDesignTotalNumber: designCount,
      recruitEtcTotalNumber: etcCount,
      recruitCategory: category.join('/'),
      recruitSubCategory: subCategory.join('/'),
      ...rest,
    });

    const result = await this.getProjectById(projectId);

    return {
      id: result.id,
      createdAt: result.createdAt,
      name: result.name,
      state: result.state,
      recruitExpiredAt: result.recruitExpiredAt,
      recruitTotalNumber: result.recruitTotalNumber,
      confirmedNumber: result.confirmedNumber,
      recruitDevTotalNumber: result.recruitDevTotalNumber,
      recruitDesignTotalNumber: result.recruitDesignTotalNumber,
      recruitEtcTotalNumber: result.recruitEtcTotalNumber,
      recruitCategory: category,
      recruitSubCategory: subCategory,
      userName: result.userName,
      numberOfViews: result.numberOfViews,
      numberOfLikes: result.numberOfLikes,
      content: result.content.toString(),
      url: result.url,
      file: result.file,
      profile: profileData,
      userId: result.userId,
      categoryInfo,
    };
  }

  async deleteProject(id: string) {
    const now = new Date();

    try {
      await this.projectRepository.update(id, { deletedAt: now });
    } catch (e) {
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }

    return true;
  }

  async getOneProject(id: string, userId?: string) {
    let isLike = false;

    const projectData = await this.projectRepository.find({
      where: { id, deletedAt: IsNull() },
      relations: ['user'],
    });

    if (!projectData.length) {
      throw new HttpException('Project NotFound', HttpStatus.NOT_FOUND);
    }

    // NOTE: 사용자가 프로젝트 등록시 입력한 프로필 ID로 조회
    const profile = await this.profileService.getProfileById(
      projectData[0].profileId,
    );

    await this.projectRepository.update(id, {
      numberOfViews: projectData[0].numberOfViews + 1,
    });

    const categoryArray = [];

    for (let i = 1; i <= 10; i++) {
      if (!projectData[0][`category${i}_1`]) break;

      categoryArray.push({
        category: projectData[0][`category${i}_1`],
        subCategory: projectData[0][`category${i}_2`],
        count: projectData[0][`category${i}Number`],
      });
    }

    if (userId) {
      isLike = await this.likeService.getProjectUserLike(id, userId);
    }

    return {
      id: projectData[0].id,
      createdAt: projectData[0].createdAt,
      name: projectData[0].name,
      state: projectData[0].state,
      recruitExpiredAt: projectData[0].recruitExpiredAt,
      recruitTotalNumber: projectData[0].recruitTotalNumber,
      confirmedNumber: projectData[0].confirmedNumber,
      recruitDevTotalNumber: projectData[0].recruitDevTotalNumber,
      recruitDesignTotalNumber: projectData[0].recruitDesignTotalNumber,
      recruitEtcTotalNumber: projectData[0].recruitEtcTotalNumber,
      recruitCategory: projectData[0].recruitCategory.split('/'),
      recruitSubCategory: projectData[0].recruitSubCategory.split('/'),
      userName: projectData[0].userName,
      numberOfViews: projectData[0].numberOfViews,
      numberOfLikes: projectData[0].numberOfLikes,
      content: projectData[0].content.toString(),
      url: projectData[0].url,
      file: projectData[0].file,
      userId: projectData[0].userId,
      categoryInfo: categoryArray,
      user: projectData[0].user,
      profile,
      isLike,
    };
  }

  async getforCreateComment(id: string, userId: string) {
    // NOTE: 프로젝트 존재 여부 확인
    const projectData = await this.projectRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!projectData)
      throw new HttpException('Project NotFound', HttpStatus.NOT_FOUND);

    // NOTE: 댓글을 등록한 사용자 데이터 조회
    const userData = await this.userService.getUserById(userId);

    return {
      nickname: userData.nickname,
      jobType: userData.jobType,
      profileImageUrl: userData.profileImageUrl,
      projectUserId: projectData.userId,
      projectName: projectData.name,
    };
  }

  // NOTE: 프로젝트 지원하기 로직
  async applyProject(projectId, userId) {
    // NOTE: 조회하기
    const result = await this.projectRepository.findOneBy({ id: projectId });

    if (result.state !== EProjectState.RECRUITING) {
      throw new HttpException(
        '프로젝트 모집이 마감되어 지원이 불가능합니다.',
        HttpStatus.CONFLICT,
      );
    }

    // NOTE: 지원자 수 업데이트하기
    await this.projectRepository.update(projectId, {
      applicantTotalNumber: result.applicantTotalNumber + 1,
    });

    // NOTE: 사용자의 지원 횟수 업데이트하기
    const { profileImageUrl, nickname, jobType } =
      await this.userService.updateApply(userId);

    return {
      projectUserId: result.userId,
      name: result.name,
      applicantTotalNumber: result.applicantTotalNumber + 1,
      profileImageUrl,
      nickname,
      jobType,
    };
  }

  // NOTE: 프로젝트 확인 로직
  async checkApply(projectId) {
    // NOTE: 프로젝트 이름 조회하기
    const result = await this.projectRepository.findOneBy({ id: projectId });

    return {
      name: result.name,
    };
  }

  // NOTE: 프로젝트 참여확정 로직
  async confirmedProject(projectId, userId) {
    // NOTE: 조회하기
    const result = await this.projectRepository.findOneBy({ id: projectId });

    // NOTE: 만약 현재 지원자를 참여 확정한 후 인원이 다 찼다면 프로젝트 모집 상태 변경하기
    if (result.confirmedNumber + 1 === result.recruitTotalNumber) {
      await this.projectRepository.update(projectId, {
        state: EProjectState.COMPLETED,
        confirmedNumber: result.confirmedNumber + 1,
      });
    } else {
      // NOTE: 참여 확정자 수 업데이트하기
      await this.projectRepository.update(projectId, {
        confirmedNumber: result.confirmedNumber + 1,
      });
    }

    // NOTE: 사용자의 참여확정 횟수 업데이트하기
    await this.userService.confirmedApply(userId);

    return {
      name: result.name,
    };
  }

  // NOTE: 프로젝트 확정취소 로직
  async cancelApply(projectId: string, state: EApplyState) {
    // NOTE: 프로젝트 이름 조회하기
    const result = await this.projectRepository.findOneBy({ id: projectId });

    // NOTE: 지원 확정 -> 지원 취소 변경이므로 확정인원 -1 해주기 + 해당 인원 포함해서 지원 완료된 프로젝트라면

    if (state === EApplyState.CONFIRMED) {
      await this.projectRepository.update(
        { id: projectId },
        { confirmedNumber: result.confirmedNumber - 1 },
      );
    }

    return {
      name: result.name,
    };
  }

  // NOTE: 프로젝트 거절 로직
  async rejectApply(projectId: string, state: EApplyState) {
    // NOTE: 프로젝트 이름 조회하기
    const result = await this.projectRepository.findOneBy({ id: projectId });

    // NOTE: 지원 확정 -> 지원 취소 변경이므로 확정인원 -1 해주기 + 해당 인원 포함해서 지원 완료된 프로젝트라면

    if (state === EApplyState.CONFIRMED) {
      await this.projectRepository.update(
        { id: projectId },
        { confirmedNumber: result.confirmedNumber - 1 },
      );
    }

    return {
      name: result.name,
    };
  }

  // NOTE: 지원자 상세 조회
  async getApplicant(profileId: string) {
    const profile = await this.profileService.getProfileById(profileId);

    return profile;
  }

  async getLikesCount(projectId: string) {
    const data = await this.projectRepository.findOneBy({
      id: projectId,
      deletedAt: IsNull(),
    });

    return data.numberOfLikes;
  }

  async getAllProjectIdList(): Promise<{ id: string }[]> {
    const result = await this.projectRepository.find({
      where: {
        deletedAt: IsNull(),
      },
      select: ['id'],
    });

    return result;
  }

  async updateLikes(projectId: string, likeCount: number) {
    const data = await this.projectRepository.findOneBy({
      id: projectId,
      deletedAt: IsNull(),
    });

    await this.projectRepository.update(
      { id: projectId },
      { numberOfLikes: data.numberOfLikes + likeCount },
    );
  }

  async getLikedProjectList(
    { ...query }: GetDashboardProjectsQueryDto,
    userId: string,
  ) {
    const { skip, take = '6' } = query;

    const likeProjectList = await this.likeService.getLikedProjects(userId);

    if (!likeProjectList.length) {
      return { list: [] };
    }

    // NOTE: 최신순으로 프로젝트 조회
    const list = await this.projectRepository.findAndCount({
      where: [
        {
          deletedAt: IsNull(),
          id: In(likeProjectList),
        },
      ],
      skip: Number(skip),
      take: Number(take),
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'createdAt',
        'name',
        'content',
        'state',
        'recruitCategory',
        'recruitTotalNumber',
        'confirmedNumber',
        'userName',
        'recruitExpiredAt',
      ],
    });

    const finalList = list[0].map((data) => {
      return {
        ...data,
        recruitCategory: data.recruitCategory.split('/'),
        content: data.content.toString(),
        isLike: true,
      };
    });

    return { list: finalList };
  }

  // NOTE: 대시보드>등록 프로젝트 조회 로직
  async getRegisteredProjectList(
    { ...query }: GetDashboardProjectsQueryDto,
    userId: string,
  ) {
    const { skip, take = '6' } = query;

    // NOTE: 최신순으로 프로젝트 조회
    const list = await this.projectRepository.findAndCount({
      where: [
        {
          deletedAt: IsNull(),
          userId,
        },
      ],
      skip: Number(skip),
      take: Number(take),
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'createdAt',
        'name',
        'content',
        'state',
        'recruitCategory',
        'recruitTotalNumber',
        'confirmedNumber',
        'userName',
        'recruitExpiredAt',
      ],
    });

    const finalList = list[0].map((data) => {
      return {
        ...data,
        recruitCategory: data.recruitCategory.split('/'),
        content: data.content.toString(),
      };
    });

    return { list: finalList };
  }

  // NOTE: 대시보드>지원완료 프로젝트 조회 로직
  async getApplyProjectList(
    { ...query }: GetDashboardProjectsQueryDto,
    userId: string,
  ) {
    const { skip, take = '6' } = query;

    // NOTE: 해당 사용자가 지원한 프로젝트 조회

    const applyProjectList = await this.applyService.getUserApplyList(userId);

    if (!applyProjectList.length) {
      return { list: [] };
    }

    // NOTE: 최신순으로 프로젝트 조회
    const list = await this.projectRepository.findAndCount({
      where: [
        {
          deletedAt: IsNull(),
          id: In(applyProjectList),
        },
      ],
      skip: Number(skip),
      take: Number(take),
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'createdAt',
        'name',
        'content',
        'state',
        'recruitCategory',
        'recruitTotalNumber',
        'confirmedNumber',
        'userName',
        'recruitExpiredAt',
      ],
    });

    const finalList = list[0].map(async (data) => {
      let isLike = false;
      if (userId) {
        isLike = await this.likeService.getProjectUserLike(data.id, userId);
      }

      return {
        ...data,
        recruitCategory: data.recruitCategory.split('/'),
        content: data.content.toString(),
        isLike: isLike,
      };
    });

    return { list: finalList };
  }

  // NOTE: 대시보드>참여확정 프로젝트 조회 로직
  async getConfirmProjectList(
    { ...query }: GetDashboardProjectsQueryDto,
    userId: string,
  ) {
    const { skip, take = '6' } = query;

    // NOTE: 해당 사용자가 지원한 프로젝트 조회

    const applyProjectList = await this.applyService.getUserConfirmedList(
      userId,
    );

    if (!applyProjectList.length) {
      return { list: [] };
    }

    // NOTE: 최신순으로 프로젝트 조회
    const list = await this.projectRepository.findAndCount({
      where: [
        {
          deletedAt: IsNull(),
          id: In(applyProjectList),
        },
      ],
      skip: Number(skip),
      take: Number(take),
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'createdAt',
        'name',
        'content',
        'state',
        'recruitCategory',
        'recruitTotalNumber',
        'confirmedNumber',
        'userName',
        'recruitExpiredAt',
      ],
    });

    const finalList = list[0].map(async (data) => {
      let isLike = false;
      if (userId) {
        isLike = await this.likeService.getProjectUserLike(data.id, userId);
      }

      return {
        ...data,
        recruitCategory: data.recruitCategory.split('/'),
        content: data.content.toString(),
        isLike: isLike,
      };
    });

    return { list: finalList };
  }
}
