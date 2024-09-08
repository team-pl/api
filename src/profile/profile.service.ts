import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entity/profile.entity';
import { IsNull, Repository } from 'typeorm';
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
        'Number of profile registrations exceeded',
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
      eduData[`eduIsAttending${index + 1}`] = data.graduationDate
        ? false
        : true;
    });

    career?.map((data, index) => {
      careerData[`careerCompanyName${index + 1}`] = data.companyName;
      careerData[`careerRole${index + 1}`] = data.role;
      careerData[`careerJoinDate${index + 1}`] = data.joinDate;
      careerData[`careerQuitDate${index + 1}`] = data.quitDate;
      careerData[`careerIsWorking${index + 1}`] = data.quitDate ? false : true;
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
    const { portfolioFile, skill, edu, career, ...rest } = data;

    // NOTE: 이전에 둥록한 프로필 SELECT
    const prevProfiles = await this.profileRepository.find({
      where: { deletedAt: IsNull(), userId },
    });

    // NOTE: 이전에 등록한 프로필 개수가 3개 이성아면 등록을 못하도록 함
    if (prevProfiles.length >= 3) {
      throw new HttpException(
        'Number of profile registrations exceeded',
        HttpStatus.FORBIDDEN,
      );
    }

    const eduData = {};
    const careerData = {};

    edu?.map((data, index) => {
      eduData[`eduCategory${index + 1}`] = data.category;
      eduData[`eduSchoolName${index + 1}`] = data.schoolName;
      eduData[`eduMajor${index + 1}`] = data.major;
      eduData[`eduAdmissionDate${index + 1}`] = data.admissionDate;
      eduData[`eduGraduationDate${index + 1}`] = data.graduationDate;
      eduData[`eduIsAttending${index + 1}`] = data.graduationDate
        ? false
        : true;
    });

    career?.map((data, index) => {
      careerData[`careerCompanyName${index + 1}`] = data.companyName;
      careerData[`careerRole${index + 1}`] = data.role;
      careerData[`careerJoinDate${index + 1}`] = data.joinDate;
      careerData[`careerQuitDate${index + 1}`] = data.quitDate;
      careerData[`careerIsWorking${index + 1}`] = data.quitDate ? false : true;
    });

    if (data.id) {
      // NOTE: 프로필 임시저장 최초 생성 X
      await this.profileRepository.update(data.id, {
        portfolioFile: fileUrl,
        skill: skill && skill.length ? skill.join('&&') : '',
        ...eduData,
        ...careerData,
        ...rest,
        isTemporaryStorage: true,
      });

      const resultData = await this.getProfileById(data.id);

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
    } else {
      // NOTE: 프로필 임시저장 최초 생성

      const id = uuid();
      let name = '';

      if (data.name) {
        // NOTE: 프로필 이름이 있을때
        name = data.name;
      } else {
        // NOTE: 프로필 이름이 없을때
        name = `임시저장 ${(await this.getTempLenthByUserId(userId)) + 1}`;
      }

      const profile = await this.profileRepository.create({
        id,
        userId,
        portfolioFile: fileUrl,
        skill: skill && skill.length ? skill.join('&&') : '',
        ...eduData,
        ...careerData,
        ...rest,
        name,
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
  }

  async getProfileById(id: string) {
    const profileData = await this.profileRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });

    if (!profileData)
      throw new HttpException('Profile NotFound', HttpStatus.NOT_FOUND);

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
    const now = new Date();
    await this.profileRepository.update(id, { deletedAt: now });
    return true;
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

    const eduData = {};
    const careerData = {};

    edu?.map((data, index) => {
      eduData[`eduCategory${index + 1}`] = data.category;
      eduData[`eduSchoolName${index + 1}`] = data.schoolName;
      eduData[`eduMajor${index + 1}`] = data.major;
      eduData[`eduAdmissionDate${index + 1}`] = data.admissionDate;
      eduData[`eduGraduationDate${index + 1}`] = data.graduationDate;
      eduData[`eduIsAttending${index + 1}`] = data.graduationDate
        ? false
        : true;
    });

    career?.map((data, index) => {
      careerData[`careerCompanyName${index + 1}`] = data.companyName;
      careerData[`careerRole${index + 1}`] = data.role;
      careerData[`careerJoinDate${index + 1}`] = data.joinDate;
      careerData[`careerQuitDate${index + 1}`] = data.quitDate;
      careerData[`careerIsWorking${index + 1}`] = data.quitDate ? false : true;
    });

    // NOTE: 프로필 수정
    if (fileUrl) {
      await this.profileRepository.update(profileId, {
        portfolioFile: fileUrl,
        skill: skill.join('&&'),
        ...eduData,
        ...careerData,
        ...rest,
      });
    } else {
      await this.profileRepository.update(profileId, {
        skill: skill.join('&&'),
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

  async getAllProfile(userId: string) {
    // NOTE: 대표 프로필 먼저 SELECT
    const representativeProfile = await this.profileRepository.findOneBy({
      userId,
      deletedAt: IsNull(),
      isRepresentative: true,
    });

    // NOTE: 기본 프로필을 최신순으로 SELECT
    const profileArray = await this.profileRepository.find({
      where: {
        userId,
        deletedAt: IsNull(),
        isRepresentative: false,
      },
      order: { createdAt: 'DESC' },
    });

    // NOTE: 프로필 데이터 합치기
    const totalProfile = [representativeProfile, ...profileArray];

    // NOTE: 웹사이트에 보내기 위해서 데이터 가공
    const result = totalProfile.map((data) => {
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
    });

    const user = await this.userService.getMyInfo(userId);

    return {
      user,
      profile: result,
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

  async getMyProfileList(userId: string) {
    const list = await this.profileRepository.findAndCount({
      where: {
        deletedAt: IsNull(),
        userId,
      },
      select: ['id', 'createdAt', 'name', 'isRepresentative'],
      order: { createdAt: 'DESC' },
    });

    return {
      list: list[0],
      count: list[1],
    };
  }
}
