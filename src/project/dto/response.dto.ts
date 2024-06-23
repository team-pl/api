import { ApiProperty } from '@nestjs/swagger';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { ECategory1, ECategory2, EProjectState } from 'src/type/project.type';
import { GetUserResDto } from 'src/user/dto/response.dto';

export class CategoryResDto {
  @ApiProperty({
    description: '프로젝트 카테고리1',
    enum: ECategory1,
  })
  category: ECategory1;

  @ApiProperty({
    description: '프로젝트 카테고리2',
    enum: ECategory2,
  })
  subCategory: ECategory2;

  @ApiProperty({ description: '모집인원' })
  count: number;
}

export class PostProjectResDto {
  @ApiProperty({ description: '프로젝트 고유 ID' })
  id: string;

  @ApiProperty({ description: '프로젝트 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로젝트명' })
  name: string;

  @ApiProperty({
    description: '프로젝트 모집 상태',
    enum: EProjectState,
  })
  state: EProjectState;

  @ApiProperty({ description: '프로젝트 모집마감일' })
  recruitExpiredAt: Date;

  @ApiProperty({ description: '프로젝트 모집인원' })
  recruitTotalNumber: number;

  @ApiProperty({ description: '프로젝트 확정인원' })
  confirmedNumber: number;

  @ApiProperty({ description: '프로젝트 개발자 모집인원' })
  recruitDevTotalNumber: number;

  @ApiProperty({ description: '프로젝트 디자이너 모집인원' })
  recruitDesignTotalNumber: number;

  @ApiProperty({ description: '프로젝트 기타 모집인원' })
  recruitEtcTotalNumber: number;

  @ApiProperty({
    description: '프로젝트 모집 카테고리',
    isArray: true,
    enum: ECategory1,
  })
  recruitCategory: ECategory1[];

  @ApiProperty({
    description: '프로젝트 모집 하위카테고리',
    isArray: true,
    enum: ECategory2,
  })
  recruitSubCategory: ECategory2[];

  @ApiProperty({
    description: '프로젝트 모집글을 작성한 사용자 이름',
  })
  userName: string;

  @ApiProperty({ description: '프로젝트 조회수' })
  numberOfViews: number;

  @ApiProperty({ description: '프로젝트 좋아요수' })
  numberOfLikes: number;

  @ApiProperty({ description: '프로젝트 모집내용' })
  content: string;

  @ApiProperty({ description: '프로젝트 관련 참고 url', nullable: true })
  url: string | null;

  @ApiProperty({ description: '프로젝트 관련 파일', nullable: true })
  file: string | null;

  @ApiProperty({
    description: '프로젝트 모집자가 선택한 프로필 정보',
    type: CreateProfileDto,
  })
  profile: CreateProfileDto[];

  @ApiProperty({ description: '프로젝트 모집자의 ID (user_entity.id)' })
  userId: string;

  @ApiProperty({
    description: '모집 카테고리 정보',
    isArray: true,
  })
  categoryInfo: CategoryResDto;
}

export class HomeProjectListResDto {
  @ApiProperty({ description: '프로젝트 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로젝트 등록일', type: Date })
  createdAt: Date;

  @ApiProperty({ description: '프로젝트명' })
  name: string;

  @ApiProperty({ description: '프로젝트 모집내용' })
  content: string;

  @ApiProperty({
    description: '프로젝트 모집 상태',
    enum: EProjectState,
  })
  state: EProjectState;

  @ApiProperty({
    description: '프로젝트 모집 카테고리',
    isArray: true,
    enum: ECategory1,
  })
  recruitCategory: ECategory1[];

  @ApiProperty({ description: '프로젝트 모집인원' })
  recruitTotalNumber: number;

  @ApiProperty({ description: '프로젝트 확정인원' })
  confirmedNumber: number;

  @ApiProperty({
    description: '프로젝트 모집글을 작성한 사용자 이름',
  })
  userName: string;

  @ApiProperty({ description: '프로젝트 모집마감일', type: Date })
  recruitExpiredAt: Date;

  @ApiProperty({ description: '사용자의 해당 프로젝트에 대한 좋아요(찜) 여부' })
  isLike: boolean;
}

export class ProjectDataResDto {
  @ApiProperty({
    description: '프로젝트 데이터 형식',
    type: HomeProjectListResDto,
    isArray: true,
  })
  list: HomeProjectListResDto[];
}

export class HomeProjectResDto {
  @ApiProperty({
    description: '인기 프로젝트 조회 결과',
    isArray: true,
  })
  popular: HomeProjectListResDto;

  @ApiProperty({
    description: '신규 프로젝트 조회 결과',
    isArray: true,
  })
  new: HomeProjectListResDto;
}

export class UpdateProjectResDto {
  @ApiProperty({ description: '프로젝트 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로젝트 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로젝트명' })
  name: string;

  @ApiProperty({
    description: '프로젝트 모집 상태',
    enum: EProjectState,
  })
  state: EProjectState;

  @ApiProperty({ description: '프로젝트 모집마감일' })
  recruitExpiredAt: Date;

  @ApiProperty({ description: '프로젝트 모집인원' })
  recruitTotalNumber: number;

  @ApiProperty({ description: '프로젝트 확정인원' })
  confirmedNumber: number;

  @ApiProperty({ description: '프로젝트 개발자 모집인원' })
  recruitDevTotalNumber: number;

  @ApiProperty({ description: '프로젝트 디자이너 모집인원' })
  recruitDesignTotalNumber: number;

  @ApiProperty({ description: '프로젝트 기타 모집인원' })
  recruitEtcTotalNumber: number;

  @ApiProperty({
    description: '프로젝트 모집 카테고리',
    isArray: true,
    enum: ECategory1,
  })
  recruitCategory: ECategory1[];

  @ApiProperty({
    description: '프로젝트 모집 하위카테고리',
    isArray: true,
    enum: ECategory2,
  })
  recruitSubCategory: ECategory2[];

  @ApiProperty({
    description: '프로젝트 모집글을 작성한 사용자 이름',
  })
  userName: string;

  @ApiProperty({ description: '프로젝트 조회수' })
  numberOfViews: number;

  @ApiProperty({ description: '프로젝트 좋아요수' })
  numberOfLikes: number;

  @ApiProperty({ description: '프로젝트 모집내용' })
  content: string;

  @ApiProperty({ description: '프로젝트 관련 참고 url', nullable: true })
  url: string | null;

  @ApiProperty({ description: '프로젝트 관련 파일', nullable: true })
  file: string | null;

  @ApiProperty({
    description: '프로젝트 모집자가 선택한 프로필 정보',
    type: CreateProfileDto,
  })
  profile: CreateProfileDto[];

  @ApiProperty({ description: '프로젝트 모집자의 ID (user_entity.id)' })
  userId: string;

  @ApiProperty({
    description: '모집 카테고리 정보',
    isArray: true,
  })
  categoryInfo: CategoryResDto;
}

export class DeleteProjectResDto {
  @ApiProperty({
    description: '프로젝트 삭제 결과',
  })
  result: boolean;
}

export class GetOneProjectResDto {
  @ApiProperty({ description: '프로젝트 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로젝트 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로젝트명' })
  name: string;

  @ApiProperty({
    description: '프로젝트 모집 상태',
    enum: EProjectState,
  })
  state: EProjectState;

  @ApiProperty({ description: '프로젝트 모집마감일' })
  recruitExpiredAt: Date;

  @ApiProperty({ description: '프로젝트 모집인원' })
  recruitTotalNumber: number;

  @ApiProperty({ description: '프로젝트 확정인원' })
  confirmedNumber: number;

  @ApiProperty({ description: '프로젝트 개발자 모집인원' })
  recruitDevTotalNumber: number;

  @ApiProperty({ description: '프로젝트 디자이너 모집인원' })
  recruitDesignTotalNumber: number;

  @ApiProperty({ description: '프로젝트 기타 모집인원' })
  recruitEtcTotalNumber: number;

  @ApiProperty({
    description: '프로젝트 모집 카테고리',
    isArray: true,
    enum: ECategory1,
  })
  recruitCategory: ECategory1[];

  @ApiProperty({
    description: '프로젝트 모집 하위카테고리',
    isArray: true,
    enum: ECategory2,
  })
  recruitSubCategory: ECategory2[];

  @ApiProperty({
    description: '프로젝트 모집글을 작성한 사용자 이름',
  })
  userName: string;

  @ApiProperty({ description: '프로젝트 조회수' })
  numberOfViews: number;

  @ApiProperty({ description: '프로젝트 좋아요수' })
  numberOfLikes: number;

  @ApiProperty({ description: '프로젝트 모집내용' })
  content: string;

  @ApiProperty({ description: '프로젝트 관련 참고 url', nullable: true })
  url: string | null;

  @ApiProperty({ description: '프로젝트 관련 파일', nullable: true })
  file: string | null;

  @ApiProperty({ description: '프로젝트 모집자의 ID (user_entity.id)' })
  userId: string;

  @ApiProperty({
    description: '모집 카테고리 정보',
    isArray: true,
  })
  categoryInfo: CategoryResDto;

  @ApiProperty({
    description: '프로젝트를 등록한 사용자 정보',
  })
  user: GetUserResDto;

  @ApiProperty({
    description: '프로젝트 모집자가 선택한 프로필 정보',
    type: CreateProfileDto,
  })
  profile: CreateProfileDto;

  @ApiProperty({ description: '사용자의 해당 프로젝트에 대한 좋아요(찜) 여부' })
  isLike: boolean;
}

export class GetProjectListResDto {
  @ApiProperty({ description: '프로젝트 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로젝트 등록일', type: Date })
  createdAt: Date;

  @ApiProperty({ description: '프로젝트명' })
  name: string;

  @ApiProperty({ description: '프로젝트 모집내용' })
  content: string;

  @ApiProperty({
    description: '프로젝트 모집 상태',
    enum: EProjectState,
  })
  state: EProjectState;

  @ApiProperty({
    description: '프로젝트 모집 카테고리',
    isArray: true,
    enum: ECategory1,
  })
  recruitCategory: ECategory1[];

  @ApiProperty({ description: '프로젝트 모집인원' })
  recruitTotalNumber: number;

  @ApiProperty({ description: '프로젝트 확정인원' })
  confirmedNumber: number;

  @ApiProperty({
    description: '프로젝트 모집글을 작성한 사용자 이름',
  })
  userName: string;

  @ApiProperty({ description: '프로젝트 모집마감일', type: Date })
  recruitExpiredAt: Date;
}

export class RegisterProjectDataResDto {
  @ApiProperty({
    description: '프로젝트 데이터 형식',
    type: GetProjectListResDto,
    isArray: true,
  })
  list: GetProjectListResDto[];
}

export class ProjectFindDataResDto {
  @ApiProperty({
    description: '프로젝트 데이터 형식',
    type: HomeProjectListResDto,
    isArray: true,
  })
  list: HomeProjectListResDto[];

  @ApiProperty({ description: '프로젝트 데이터 개수' })
  count: number;
}
