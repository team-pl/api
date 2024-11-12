import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entity/profile.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { v4 as uuid } from 'uuid';
import { UserService } from 'src/user/user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileTempDto } from './dto/create-profile-temporary.dto';
import { CreateTestProfileDto } from './dto/create-test-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly userService: UserService,
  ) {}

  async create(data: CreateProfileDto, userId: string, fileUrl: string | null) {
    const id = uuid();

    const { portfolioFile, skill, edu, career, tempProfileId, ...rest } = data;

    // NOTE: 이전에 둥록한 프로필 SELECT
    const prevProfiles = await this.profileRepository.find({
      where: { deletedAt: IsNull(), userId },
    });

    // NOTE: 이전에 등록한 프로필 개수가 3개 이상 (+ 임시저장 글 등록X)일때 등록을 못하도록 함
    if (prevProfiles.length >= 3 && !tempProfileId) {
      throw new HttpException(
        '등록 가능한 프로필 개수를 초과했습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    // NOTE: 현재 등록한 프로필을 대표 프로필로 지정하려고 할때
    if (rest.isRepresentative) {
      // NOTE: 이전에 등록한 프로필 중에서 대표 프로필이 있는지 확인
      const prevRepresentative = prevProfiles.filter(
        (data) => data.isRepresentative,
      );

      if (prevRepresentative.length > 0) {
        const idList = prevRepresentative.map((data) => data.id);
        // NOTE: 기존 대표 프로필을 기본 프로필로 변경
        await this.profileRepository.update(idList, {
          isRepresentative: false,
        });
      }

      // NOTE: user 테이블에서 대표 프로필 ID 수정
      await this.userService.updateUser(userId, {
        representativeProfileId: id,
      });
    }

    // NOTE: 현재 등록하려는 프로필이 임시저장된 프로필일때 기존 임시저장된 프로필 제거
    if (tempProfileId) {
      const now = new Date();
      await this.profileRepository.update(tempProfileId, {
        deletedAt: now,
      });
    }

    const eduData = {};
    const careerData = {};

    edu?.map((data, index) => {
      eduData[`eduCategory${index + 1}`] = data.category;
      eduData[`eduSchoolName${index + 1}`] = data.schoolName;
      eduData[`eduMajor${index + 1}`] = data.major;
      eduData[`eduAdmissionDate${index + 1}`] = data.admissionDate;
      eduData[`eduGraduationDate${index + 1}`] = data.graduationDate;
      eduData[`eduIsAttending${index + 1}`] = data.isAttending;
    });

    career?.map((data, index) => {
      careerData[`careerCompanyName${index + 1}`] = data.companyName;
      careerData[`careerRole${index + 1}`] = data.role;
      careerData[`careerJoinDate${index + 1}`] = data.joinDate;
      careerData[`careerQuitDate${index + 1}`] = data.quitDate;
      careerData[`careerIsWorking${index + 1}`] = data.isWorking;
    });

    // NOTE: 프로필 생성
    const profile = await this.profileRepository.create({
      id,
      userId,
      portfolioFile: fileUrl,
      skill: skill.join('&&'),
      ...eduData,
      ...careerData,
      ...rest,
    });

    const resultData = await this.profileRepository.save(profile);

    return {
      id: resultData.id,
      createdAt: resultData.createdAt,
      userId: resultData.userId,
      name: resultData.name,
      isRepresentative: resultData.isRepresentative,
      edu: edu ? edu : [],
      career: career ? career : [],
      skill: skill ? skill : [],
      portfolioUrl: resultData.portfolioUrl,
      portfolioFile: fileUrl,
      isTemporaryStorage: resultData.isTemporaryStorage,
    };
  }

  async temporaryStorage(
    data: CreateProfileTempDto,
    userId: string,
    fileUrl: string | null,
  ) {
    const { id, portfolioFile, skill, edu, career, ...rest } = data;

    // NOTE: 이전에 둥록한 프로필 SELECT
    const prevProfiles = await this.profileRepository.find({
      where: { deletedAt: IsNull(), userId },
    });

    // NOTE: 이전에 등록한 프로필 개수가 3개 이성아면 등록을 못하도록 함
    if (prevProfiles.length >= 3 && !data.id) {
      throw new HttpException(
        '등록 가능한 프로필 개수를 초과했습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    // NOTE: 기존 임시저장된 프로필 삭제
    if (id) {
      const now = new Date();
      await this.profileRepository.update(id, {
        deletedAt: now,
      });
    }

    const eduData = {};
    const careerData = {};

    edu?.map((data, index) => {
      eduData[`eduCategory${index + 1}`] = data.category;
      eduData[`eduSchoolName${index + 1}`] = data.schoolName;
      eduData[`eduMajor${index + 1}`] = data.major;
      eduData[`eduAdmissionDate${index + 1}`] = data.admissionDate;
      eduData[`eduGraduationDate${index + 1}`] = data.graduationDate;
      eduData[`eduIsAttending${index + 1}`] = data.isAttending;
    });

    career?.map((data, index) => {
      careerData[`careerCompanyName${index + 1}`] = data.companyName;
      careerData[`careerRole${index + 1}`] = data.role;
      careerData[`careerJoinDate${index + 1}`] = data.joinDate;
      careerData[`careerQuitDate${index + 1}`] = data.quitDate;
      careerData[`careerIsWorking${index + 1}`] = data.isWorking;
    });

    // NOTE: 프로필 임시저장 생성
    const newProfileId = uuid();
    let name = '';

    if (data.name) {
      // NOTE: 프로필 이름이 있을때
      name = data.name;
    } else {
      // NOTE: 프로필 이름이 없을때
      name = `임시저장 ${(await this.getTempLenthByUserId(userId)) + 1}`;
    }

    const profile = await this.profileRepository.create({
      id: newProfileId,
      userId,
      portfolioFile: fileUrl,
      skill: skill && skill.length ? skill.join('&&') : '',
      ...eduData,
      ...careerData,
      ...rest,
      name,
      isRepresentative: rest.isRepresentative ?? true,
      isTemporaryStorage: true,
    });

    const resultData = await this.profileRepository.save(profile);

    return {
      id: resultData.id,
      createdAt: resultData.createdAt,
      userId: resultData.userId,
      name: resultData.name,
      isRepresentative: resultData.isRepresentative,
      edu: edu ? edu : [],
      career: career ? career : [],
      skill: skill ? skill : [],
      portfolioUrl: resultData.portfolioUrl,
      portfolioFile: fileUrl,
      isTemporaryStorage: resultData.isTemporaryStorage,
    };
  }

  async getProfileById(id: string) {
    const profileData = await this.profileRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });

    if (!profileData)
      throw new HttpException(
        '존재하지 않는 프로필입니다.',
        HttpStatus.NOT_FOUND,
      );

    return profileData;
  }

  async getTempLenthByUserId(userId: string) {
    const data = await this.profileRepository.findBy({
      userId,
      deletedAt: IsNull(),
      isTemporaryStorage: true,
    });

    return data.length;
  }

  async deleteProfile(id: string) {
    await this.profileRepository.update(id, { isDeleted: true });
    return {
      result: true,
    };
  }

  async updateProfile(
    profileId: string,
    data: UpdateProfileDto,
    userId: string,
    fileUrl: string | null,
  ) {
    const { portfolioFile, skill, edu, career, ...rest } = data;

    // NOTE: 이전에 둥록한 프로필 SELECT
    const prevProfiles = await this.profileRepository.find({
      where: { deletedAt: IsNull(), userId },
    });

    // NOTE: 현재 수정하는 프로필을 대표 프로필로 지정하려고 할때
    if (rest.isRepresentative) {
      // NOTE: 이전에 등록한 프로필 중에서 대표 프로필이 있는지 확인
      const prevRepresentative = prevProfiles.filter(
        (data) => data.isRepresentative,
      );

      if (prevRepresentative.length > 0) {
        const idList = prevRepresentative.map((data) => data.id);
        // NOTE: 기존 대표 프로필을 기본 프로필로 변경
        await this.profileRepository.update(idList, {
          isRepresentative: false,
        });
      }

      // NOTE: user 테이블에서 대표 프로필 ID 수정
      await this.userService.updateUser(userId, {
        representativeProfileId: profileId,
      });
    }

    const eduArray = edu
      ? Array.from({ length: 5 }, (_, index) => edu[index] || null)
      : Array.from({ length: 5 }, (_) => null);

    const careerArray = career
      ? Array.from({ length: 10 }, (_, index) => career[index] || null)
      : Array.from({ length: 10 }, (_) => null);

    const eduData = {};
    const careerData = {};

    eduArray.map((data, index) => {
      if (!data) {
        eduData[`eduCategory${index + 1}`] = null;
        eduData[`eduSchoolName${index + 1}`] = null;
        eduData[`eduMajor${index + 1}`] = null;
        eduData[`eduAdmissionDate${index + 1}`] = null;
        eduData[`eduGraduationDate${index + 1}`] = null;
        eduData[`eduIsAttending${index + 1}`] = null;
      } else {
        eduData[`eduCategory${index + 1}`] = data.category;
        eduData[`eduSchoolName${index + 1}`] = data.schoolName;
        eduData[`eduMajor${index + 1}`] = data.major;
        eduData[`eduAdmissionDate${index + 1}`] = data.admissionDate;
        eduData[`eduGraduationDate${index + 1}`] = data.graduationDate;
        eduData[`eduIsAttending${index + 1}`] = data.isAttending;
      }
    });

    careerArray.map((data, index) => {
      if (!data) {
        careerData[`careerCompanyName${index + 1}`] = null;
        careerData[`careerRole${index + 1}`] = null;
        careerData[`careerJoinDate${index + 1}`] = null;
        careerData[`careerQuitDate${index + 1}`] = null;
        careerData[`careerIsWorking${index + 1}`] = null;
      } else {
        careerData[`careerCompanyName${index + 1}`] = data.companyName;
        careerData[`careerRole${index + 1}`] = data.role;
        careerData[`careerJoinDate${index + 1}`] = data.joinDate;
        careerData[`careerQuitDate${index + 1}`] = data.quitDate;
        careerData[`careerIsWorking${index + 1}`] = data.isWorking;
      }
    });

    // NOTE: 프로필 수정
    if (fileUrl) {
      await this.profileRepository.update(profileId, {
        portfolioFile: fileUrl,
        skill: skill && skill.length ? skill.join('&&') : '',
        ...eduData,
        ...careerData,
        ...rest,
      });
    } else {
      await this.profileRepository.update(profileId, {
        skill: skill && skill.length ? skill.join('&&') : '',
        ...eduData,
        ...careerData,
        ...rest,
      });
    }

    const resultData = await this.getProfileById(profileId);

    return {
      id: resultData.id,
      createdAt: resultData.createdAt,
      userId: resultData.userId,
      name: resultData.name,
      isRepresentative: resultData.isRepresentative,
      edu: edu ? edu : [],
      career: career ? career : [],
      skill: skill ? skill : [],
      portfolioUrl: resultData.portfolioUrl,
      portfolioFile: fileUrl,
      isTemporaryStorage: resultData.isTemporaryStorage,
    };
  }

  // NOTE: 마이페이지에서 임시저장한 프로필까지 조회하는 API 로직
  async getAllProfile(userId: string) {
    // NOTE: 대표 프로필 먼저 SELECT
    const representativeProfile = await this.profileRepository.findOne({
      where: {
        userId,
        deletedAt: IsNull(),
        isDeleted: false,
        isRepresentative: true,
        isTemporaryStorage: false,
      },
      select: [
        'id',
        'createdAt',
        'name',
        'isRepresentative',
        'isTemporaryStorage',
      ],
    });

    // NOTE: 프로필을 최신순으로 SELECT
    const profileArray = await this.profileRepository.find({
      where: {
        userId,
        deletedAt: IsNull(),
        isDeleted: false,
        id: representativeProfile && Not(representativeProfile.id),
      },
      select: [
        'id',
        'createdAt',
        'name',
        'isRepresentative',
        'isTemporaryStorage',
      ],
      order: { createdAt: 'DESC' },
    });

    // NOTE: 프로필 데이터 합치기
    const totalProfile = [representativeProfile, ...profileArray];

    return {
      result: totalProfile,
    };
  }

  // NOTE: 프로젝트 등록/수정페이지에서 임시저장 프로필 제외하고 조회하는 API 로직
  async getAllProfileForProject(userId: string) {
    // NOTE: 대표 프로필 먼저 SELECT
    const representativeProfile = await this.profileRepository.findOne({
      where: {
        userId,
        deletedAt: IsNull(),
        isDeleted: false,
        isRepresentative: true,
        isTemporaryStorage: false,
      },
      select: [
        'id',
        'createdAt',
        'name',
        'isRepresentative',
        'isTemporaryStorage',
      ],
    });

    // NOTE: 프로필을 최신순으로 SELECT
    const profileArray = await this.profileRepository.find({
      where: {
        userId,
        deletedAt: IsNull(),
        isDeleted: false,
        id: representativeProfile && Not(representativeProfile.id),
        isTemporaryStorage: false,
      },
      select: [
        'id',
        'createdAt',
        'name',
        'isRepresentative',
        'isTemporaryStorage',
      ],
      order: { createdAt: 'DESC' },
    });

    // NOTE: 프로필 데이터 합치기
    const totalProfile = [representativeProfile, ...profileArray];

    return {
      result: totalProfile,
    };
  }

  async getOneProfile(id: string) {
    const data = await this.profileRepository.findOneBy({ id });

    if (!data) {
      throw new HttpException(
        '존재하지 않는 프로필입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const eduArray = [];
    const careerArray = [];

    for (let i = 1; i <= 5; i++) {
      if (!data[`eduCategory${i}`]) break;

      eduArray.push({
        category: data[`eduCategory${i}`],
        schoolName: data[`eduSchoolName${i}`],
        major: data[`eduMajor${i}`],
        admissionDate: data[`eduAdmissionDate${i}`],
        graduationDate: data[`eduGraduationDate${i}`],
        isAttending: data[`eduIsAttending${i}`],
      });
    }

    for (let i = 1; i <= 10; i++) {
      if (!data[`careerCompanyName${i}`]) break;

      careerArray.push({
        companyName: data[`careerCompanyName${i}`],
        role: data[`careerRole${i}`],
        joinDate: data[`careerJoinDate${i}`],
        quitDate: data[`careerQuitDate${i}`],
        isWorking: data[`careerIsWorking${i}`],
      });
    }

    return {
      id: data.id,
      createdAt: data.createdAt,
      name: data.name,
      isRepresentative: data.isRepresentative,
      edu: eduArray,
      career: careerArray,
      skill: data.skill.split('&&'),
      portfolioUrl: data.portfolioUrl,
      portfolioFile: data.portfolioFile,
      isTemporaryStorage: data.isTemporaryStorage,
    };
  }

  async createTestProfile(data: CreateTestProfileDto) {
    const id = uuid();
    const profileData = await this.profileRepository.create({
      id,
      ...data,
    });

    await this.profileRepository.save(profileData);

    return profileData;
  }

  // NOTE: 프로젝트 등록자의 프로필 조회를 위함
  async getProjectOwnerProfile(profileId: string) {
    const data = await this.profileRepository.findOneBy({ id: profileId });

    const eduArray = [];
    const careerArray = [];

    for (let i = 1; i <= 5; i++) {
      if (!data[`eduCategory${i}`]) break;

      eduArray.push({
        category: data[`eduCategory${i}`],
        schoolName: data[`eduSchoolName${i}`],
        major: data[`eduMajor${i}`],
        admissionDate: data[`eduAdmissionDate${i}`],
        graduationDate: data[`eduGraduationDate${i}`],
        isAttending: data[`eduIsAttending${i}`],
      });
    }

    for (let i = 1; i <= 10; i++) {
      if (!data[`careerCompanyName${i}`]) break;

      careerArray.push({
        companyName: data[`careerCompanyName${i}`],
        role: data[`careerRole${i}`],
        joinDate: data[`careerJoinDate${i}`],
        quitDate: data[`careerQuitDate${i}`],
        isWorking: data[`careerIsWorking${i}`],
      });
    }

    return {
      name: data.name,
      edu: eduArray,
      career: careerArray,
      skill: data.skill.split('&&'),
      portfolioUrl: data.portfolioUrl,
      portfolioFile: data.portfolioFile,
    };
  }

  async isProfileExists(userId: string) {
    const profileData = await this.profileRepository.findBy({
      userId,
      deletedAt: IsNull(),
      isDeleted: false,
      isTemporaryStorage: false,
    });

    return {
      result: profileData.length > 0,
    };
  }
}
