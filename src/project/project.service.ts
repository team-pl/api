import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entity/project.entity';
import { Brackets, In, IsNull, LessThan, Like, Raw, Repository } from 'typeorm';
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

    const userNickname = await this.userService.postProject(userId);

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
      profileId: profileData.id,
      recruitDevTotalNumber: devCount,
      recruitDesignTotalNumber: designCount,
      recruitEtcTotalNumber: etcCount,
      recruitTotalNumber: devCount + designCount + etcCount,
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
      profileId: profileData.id,
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
      subCategory = [],
      searchWord = '',
      userId = '',
      sort = '',
    } = query;

    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    // Select specific columns
    queryBuilder.select([
      'project.id',
      'project.deletedAt',
      'project.createdAt',
      'project.name',
      'project.content',
      'project.state',
      'project.recruitCategory',
      'project.recruitSubCategory',
      'project.userName',
      'project.recruitExpiredAt',
      'project.recruitTotalNumber',
      'project.confirmedNumber',
    ]);

    queryBuilder.andWhere('project.deletedAt IS NULL');

    if (category !== ECategorySelect.ALL) {
      queryBuilder.andWhere('project.recruitCategory LIKE :category', {
        category: `%${category}%`,
      });
    }

    // subCategory 필터링 (배열)
    if (subCategory && subCategory.length > 0) {
      const subCategoryArray = [];
      if (typeof subCategory === 'string') {
        subCategoryArray.push(subCategory);
      } else {
        subCategoryArray.push(...subCategory);
      }

      const subCategoryConditions = subCategoryArray
        .map((sub) => `project.recruitSubCategory LIKE :sub_${sub}`)
        .join(' OR ');
      subCategoryArray.forEach((sub) => {
        queryBuilder.setParameter(`sub_${sub}`, `%${sub}%`);
      });
      queryBuilder.andWhere(`(${subCategoryConditions})`);
    }

    // searchWord 필터링
    if (searchWord) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere('project.name ILIKE :searchWord')
            .orWhere('project.userName ILIKE :searchWord')
            .orWhere('project.content LIKE :searchWord');
        }),
        { searchWord: `%${searchWord}%` },
      );
    }

    if (sort) {
      let order = '';

      switch (sort) {
        case ESortDirection.POPULAR:
          order = 'numberOfScore';
          break;
        case ESortDirection.LATEST:
          order = 'createdAt';
          break;
        default:
          order = 'createdAt';
      }

      queryBuilder.orderBy('project.' + order, 'DESC');
    }

    // Pagination
    queryBuilder.skip(Number(skip)).take(Number(take));

    const list = await queryBuilder.getManyAndCount();

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
      profileId: profileData.id,
      recruitDevTotalNumber: devCount,
      recruitDesignTotalNumber: designCount,
      recruitEtcTotalNumber: etcCount,
      recruitCategory: category.join('/'),
      recruitSubCategory: subCategory.join('/'),
      recruitTotalNumber: devCount + designCount + etcCount,
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
      profileId: profileData.id,
      userId: result.userId,
      categoryInfo,
    };
  }

  async deleteProject(id: string, userId: string) {
    const now = new Date();

    const projectData = await this.projectRepository.findOneBy({ id: id });

    if (!projectData) {
      throw new HttpException('없는 프로젝트 입니다.', HttpStatus.NOT_FOUND);
    }

    if (projectData.userId !== userId) {
      throw new HttpException(
        '해당 프로젝트의 등록자가 아니므로 삭제 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      await this.projectRepository.update(id, { deletedAt: now });
    } catch (e) {
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }

    return {
      result: true,
    };
  }

  async getOneProject(id: string, userId?: string) {
    let isLike = false;
    let isApplied = false;

    const projectData = await this.projectRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user'],
    });

    if (!projectData) {
      throw new HttpException(
        '존재하지 않는 프로젝트입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const profileData = await this.profileService.getProjectOwnerProfile(
      projectData.profileId,
    );

    await this.projectRepository.update(id, {
      numberOfViews: projectData.numberOfViews + 1,
    });

    const categoryArray = [];

    for (let i = 1; i <= 10; i++) {
      if (!projectData[`category${i}_1`]) break;

      categoryArray.push({
        category: projectData[`category${i}_1`],
        subCategory: projectData[`category${i}_2`],
        count: projectData[`category${i}Number`],
      });
    }

    if (userId) {
      isLike = await this.likeService.getProjectUserLike(id, userId);
      isApplied = await this.applyService.getIsApplied({
        userId,
        projectId: id,
      });
    }

    return {
      id: projectData.id,
      createdAt: projectData.createdAt,
      name: projectData.name,
      state: projectData.state,
      recruitExpiredAt: projectData.recruitExpiredAt,
      recruitTotalNumber: projectData.recruitTotalNumber,
      confirmedNumber: projectData.confirmedNumber,
      recruitDevTotalNumber: projectData.recruitDevTotalNumber,
      recruitDesignTotalNumber: projectData.recruitDesignTotalNumber,
      recruitEtcTotalNumber: projectData.recruitEtcTotalNumber,
      recruitCategory: projectData.recruitCategory.split('/'),
      recruitSubCategory: projectData.recruitSubCategory.split('/'),
      userName: projectData.userName,
      jobType: projectData.user.jobType,
      numberOfViews: projectData.numberOfViews,
      numberOfLikes: projectData.numberOfLikes,
      content: projectData.content.toString(),
      url: projectData.url,
      file: projectData.file,
      userId: projectData.userId,
      profileImageUrl: projectData.user.profileImageUrl,
      categoryInfo: categoryArray,
      isLike,
      profile: profileData,
      isApplied,
    };
  }

  // NOTE: 댓글 생성 관련 함수
  async getforCreateComment(id: string, userId: string) {
    // NOTE: 프로젝트 존재 여부 확인
    const projectData = await this.projectRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!projectData)
      throw new HttpException(
        '존재하지 않는 프로젝트입니다.',
        HttpStatus.NOT_FOUND,
      );

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

    if (!result) {
      throw new HttpException(
        '존재하지 않는 프로젝트입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

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
    // NOTE: 프로젝트 조회하기
    const result = await this.projectRepository.findOneBy({ id: projectId });

    return {
      name: result.name,
      projectUserId: result.userId,
    };
  }

  // NOTE: 프로젝트 참여확정 로직
  async confirmedProject({
    projectId,
    applyUserId,
    projectUserId,
  }: {
    projectId: string;
    applyUserId: string;
    projectUserId: string;
  }) {
    // NOTE: 조회하기
    const result = await this.projectRepository.findOneBy({ id: projectId });

    // NOTE: 프로젝트 지원 상태 변경을 요청한 사용자와 프로젝트 등록한 사용자가 다른 경우
    if (result.userId !== projectUserId) {
      throw new HttpException(
        '프로젝트 등록한 사람만 지원상태를 변경할 수 있습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    // NOTE: 만약 현재 지원자를 참여 확정한 후 인원이 다 찼다면 프로젝트 모집 상태 변경하기
    if (result.confirmedNumber + 1 === result.recruitTotalNumber) {
      await this.projectRepository.update(projectId, {
        state: EProjectState.COMPLETED,
        confirmedNumber: result.confirmedNumber + 1,
      });
    } else if (result.confirmedNumber + 1 < result.recruitTotalNumber) {
      // NOTE: 참여 확정자 수 업데이트하기
      await this.projectRepository.update(projectId, {
        confirmedNumber: result.confirmedNumber + 1,
      });
    } else {
      // NOTE: 만약 참여 확정 인원이 다 찬 경우
      throw new HttpException(
        '모집 인원이 꽉 차서 참여확정이 불가능합니다.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // NOTE: 사용자의 참여확정 횟수 업데이트하기
    await this.userService.confirmedApply(applyUserId);

    return {
      name: result.name,
    };
  }

  // NOTE: 프로젝트 확정취소 로직
  async cancelApply({
    projectId,
    projectUserId,
    applyUserId,
  }: {
    projectId: string;
    projectUserId: string;
    applyUserId: string;
  }) {
    // NOTE: 프로젝트 이름 조회하기
    const result = await this.projectRepository.findOneBy({ id: projectId });

    if (result.userId !== projectUserId) {
      throw new HttpException(
        '프로젝트 등록한 사람만 지원상태를 변경할 수 있습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    // NOTE: 참여 확정자 수 = 모집인원인 경우(인원이 꽉 찬 경우), 프로젝트 상태 변경하기
    if (result.confirmedNumber === result.recruitTotalNumber) {
      const now = new Date();
      // NOTE: 모집 종료까지 기한이 남음
      if (result.recruitExpiredAt.getTime() >= now.getTime()) {
        await this.projectRepository.update(
          { id: projectId },
          {
            confirmedNumber: result.confirmedNumber - 1,
            state: EProjectState.RECRUITING,
          },
        );
      } else {
        // NOTE: 모집 종료까지 기한이 지남
        await this.projectRepository.update(
          { id: projectId },
          {
            confirmedNumber: result.confirmedNumber - 1,
            state: EProjectState.END,
          },
        );
      }
    }

    // NOTE: 사용자의 참여확정 횟수 업데이트하기
    await this.userService.canceledApply(applyUserId);
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

    if (!data) {
      throw new HttpException(
        '존재하지 않는 프로젝트입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

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
        'state',
        'content',
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

    const resolvedFinalList = await Promise.all(finalList);

    return { list: resolvedFinalList };
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

    const resolvedFinalList = await Promise.all(finalList);

    return { list: resolvedFinalList };
  }

  async getExpiredProjects() {
    const now = new Date();
    const list = await this.projectRepository.find({
      where: {
        deletedAt: IsNull(),
        state: EProjectState.RECRUITING,
        recruitExpiredAt: LessThan(now),
      },
      select: ['id'],
    });

    return list;
  }

  async updateExpiredProjects(idList: string[]) {
    await this.projectRepository.update(idList, { state: EProjectState.END });

    return true;
  }

  // NOTE: 지원서 목록 조회시 해당 프로젝트의 지원서 조회 여부가 만료인지 아닌지 확인
  async isExpirationPeriodOver(projectId: string) {
    const now = new Date();

    const result = await this.projectRepository.findOneBy({
      id: projectId,
      deletedAt: IsNull(),
    });

    if (!result) {
      throw new HttpException(
        '존재하지 않는 프로젝트입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      now.getTime() - result.recruitExpiredAt.getTime() >=
      1000 * 60 * 60 * 24 * 30
    ) {
      throw new HttpException(
        '기간이 만료되어 확인할 수 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
