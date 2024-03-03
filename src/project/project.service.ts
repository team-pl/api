import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  ESubCategorySelect,
} from 'src/type/project.type';
import { UserService } from 'src/user/user.service';
import { GetProjectQueryDto } from './dto/get-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  async create(data: CreateProjectDto, userId: string, fileUrl: string | null) {
    let devCount = 0;
    let designCount = 0;
    let etcCount = 0;
    const category: ECategory1[] = [];
    const subCategory: ECategory2[] = [];

    const id = uuid();

    const { recruitExpiredAt, content, file, profileId, ...rest } = data;

    // NOTE: 모집마감일이 YYYY/MM/DD 형식의 string 으로 들어옴
    const [year, month, date] = recruitExpiredAt.split('/').map(Number);

    // NOTE: 사용자가 설정한 날짜의 23시 59분 59초까지로 모집마감일을 정함
    const expiredAt = new Date(year, month - 1, date, 23, 59, 59);

    const bufferContent = Buffer.from(content, 'utf-8');

    const profileData = await this.profileService.getProfileById(profileId);

    const userNickname = await this.userService.getNicknameForProject(userId);

    for (let i = 1; i <= 10; i++) {
      if (!rest[`category${i}_1`]) break;

      subCategory.push(rest[`category${i}_2`]);

      if (rest[`category${i}_1`] === ECategory1.DEVELOPER) {
        devCount += rest[`category${i}Number`];
      } else if (rest[`category${i}_1`] === ECategory1.DESIGN) {
        designCount += rest[`category${i}Number`];
      } else {
        etcCount += rest[`category${i}Number`];
      }
    }

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
      ...rest,
    });

    const result = await this.projectRepository.save(project);

    return {
      ...result,
      content: result.content.toString(),
      profile: profileData,
    };
  }

  async getHomeProject() {
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

    const finalPopularList = popularList[0].map((data) => {
      return {
        ...data,
        content: data.content.toString(),
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

    const finalNewList = newList[0].map((data) => {
      return {
        ...data,
        content: data.content.toString(),
      };
    });

    return {
      popular: {
        list: finalPopularList,
        count: popularList[1],
      },
      new: {
        list: finalNewList,
        count: newList[1],
      },
    };
  }

  async getProjectList({ ...query }: GetProjectQueryDto) {
    const {
      skip,
      take = '12',
      category = ECategorySelect.ALL,
      subCategory = ESubCategorySelect.ALL,
      searchWord = '',
    } = query;

    const transCategory = category === ECategorySelect.ALL ? '' : category;

    const transSubCategory =
      subCategory === ESubCategorySelect.ALL ? '' : subCategory;

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
      order: { createdAt: 'DESC' },
      select: [
        'id',
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
        content: data.content.toString(),
      };
    });

    return {
      list: finalList,
      count: list[1],
    };
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

    const { recruitExpiredAt, content, file, profileId, ...rest } = data;

    // NOTE: 모집마감일이 YYYY/MM/DD 형식의 string 으로 들어옴
    const [year, month, date] = recruitExpiredAt.split('/').map(Number);

    // NOTE: 사용자가 설정한 날짜의 23시 59분 59초까지로 모집마감일을 정함
    const expiredAt = new Date(year, month - 1, date, 23, 59, 59);

    const bufferContent = Buffer.from(content, 'utf-8');

    const profileData = await this.profileService.getProfileById(profileId);

    for (let i = 1; i <= 10; i++) {
      if (!rest[`category${i}_1`]) break;

      subCategory.push(rest[`category${i}_2`]);

      if (rest[`category${i}_1`] === ECategory1.DEVELOPER) {
        devCount += rest[`category${i}Number`];
      } else if (rest[`category${i}_1`] === ECategory1.DESIGN) {
        designCount += rest[`category${i}Number`];
      } else {
        etcCount += rest[`category${i}Number`];
      }
    }

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
      ...result,
      content: result.content.toString(),
      profile: profileData,
    };
  }

  async deleteProject(id: string, userId: string) {
    const now = new Date();

    try {
      await this.projectRepository.update(id, { deletedAt: now });
      await this.userService.updateForDeleteProject(userId);
    } catch (e) {
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }

    return true;
  }

  async getOneProject(id: string) {
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

    return {
      ...projectData[0],
      content: projectData[0].content.toString(),
      profile,
    };
  }
}
