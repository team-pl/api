import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entity/profile.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { v4 as uuid } from 'uuid';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly userService: UserService,
  ) {}

  async create(data: CreateProfileDto, userId: string, fileUrl: string | null) {
    const id = uuid();

    const { portfolioFile, ...rest } = data;

    // NOTE: 아존애 둥록한 프로필 SELECT
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

    // NOTE: 현재 등록한 프로필을 대표 프로필로 지정하려고 할때
    if (rest.isRepresentative) {
      // NOTE: 이전에 등록한 프로필 중에서 대표 프로필이 있는지 확인
      const prevRepresentative = prevProfiles.filter(
        (data) => data.isRepresentative,
      );

      if (prevRepresentative.length > 0) {
        // NOTE: 기존 대표 프로필을 기본 프로필로 변경
        await this.profileRepository.update(prevRepresentative[0].id, {
          isRepresentative: false,
        });
      }

      // NOTE: user 테이블에서 대표 프로필 ID 수정
      await this.userService.updateUser(userId, {
        representativeProfileId: id,
      });
    }

    // NOTE: 프로필 생성
    const profile = await this.profileRepository.create({
      id,
      userId,
      portfolioFile: fileUrl,
      ...rest,
    });

    return await this.profileRepository.save(profile);
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
}
