import { ApiProperty } from '@nestjs/swagger';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { PostProfileResDto } from 'src/profile/dto/response.dto';
import { ECategory1, ECategory2, EProjectState } from 'src/type/project.type';
import { GetUserResDto } from 'src/user/dto/response.dto';

export class PostProjectResDto {
  @ApiProperty({ description: '프로젝트 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로젝트 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로젝트 정보 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '프로젝트 삭제일' })
  deletedAt: Date | null;

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
    example: 'DEVELOPER/DESIGN/ETC',
  })
  recruitCategory: string;

  @ApiProperty({
    description: '프로젝트 모집 하위카테고리',
    example: 'DEV_BE/DEV_FE/DESIGN_UX/DESIGN_ETC',
  })
  recruitSubCategory: string;

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
    description: '프로젝트 카테고리1의 카테고리1',
    enum: ECategory1,
  })
  category1_1: ECategory1;

  @ApiProperty({
    description: '프로젝트 카테고리1의 카테고리2',
    enum: ECategory2,
  })
  category1_2: ECategory2;

  @ApiProperty({ description: '프로젝트 카테고리1의 모집인원' })
  category1Number: number;

  @ApiProperty({
    description: '프로젝트 카테고리2의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category2_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리2의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category2_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리2의 모집인원', nullable: true })
  category2Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리3의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category3_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리3의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category3_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리3의 모집인원', nullable: true })
  category3Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리4의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category4_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리4의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category4_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리4의 모집인원', nullable: true })
  category4Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리5의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category5_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리5의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category5_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리5의 모집인원', nullable: true })
  category5Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리6의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category6_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리6의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category6_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리6의 모집인원', nullable: true })
  category6Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리7의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category7_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리7의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category7_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리7의 모집인원', nullable: true })
  category7Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리8의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category8_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리8의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category8_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리8의 모집인원', nullable: true })
  category8Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리9의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category9_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리9의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category9_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리9의 모집인원', nullable: true })
  category9Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category10_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category10_2: ECategory2 | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 모집인원',
    nullable: true,
  })
  category10Number: number | null;
}

export class HomeProjectListResDto {
  @ApiProperty({ description: '프로젝트 고유 Id' })
  id: string;

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
    example: 'DEVELOPER/DESIGN/ETC',
  })
  recruitCategory: string;

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

export class ProjectDataResDto {
  @ApiProperty({
    description: '프로젝트 데이터 형식',
    type: HomeProjectListResDto,
  })
  list: HomeProjectListResDto[];

  @ApiProperty({ description: '프로젝트 개수' })
  count: number;
}

export class HomeProjectResDto {
  @ApiProperty({
    description: '인기 프로젝트 조회 결과',
    type: ProjectDataResDto,
  })
  popular: ProjectDataResDto;

  @ApiProperty({
    description: '신규 프로젝트 조회 결과',
    type: ProjectDataResDto,
  })
  new: ProjectDataResDto;
}

export class UpdateProjectResDto {
  @ApiProperty({ description: '프로젝트 고유 Id' })
  id: string;

  @ApiProperty({ description: '프로젝트 등록일' })
  createdAt: Date;

  @ApiProperty({ description: '프로젝트 정보 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '프로젝트 삭제일' })
  deletedAt: Date | null;

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
    example: 'DEVELOPER/DESIGN/ETC',
  })
  recruitCategory: string;

  @ApiProperty({
    description: '프로젝트 모집 하위카테고리',
    example: 'DEV_BE/DEV_FE/DESIGN_UX/DESIGN_ETC',
  })
  recruitSubCategory: string;

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
    description: '프로젝트 카테고리1의 카테고리1',
    enum: ECategory1,
  })
  category1_1: ECategory1;

  @ApiProperty({
    description: '프로젝트 카테고리1의 카테고리2',
    enum: ECategory2,
  })
  category1_2: ECategory2;

  @ApiProperty({ description: '프로젝트 카테고리1의 모집인원' })
  category1Number: number;

  @ApiProperty({
    description: '프로젝트 카테고리2의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category2_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리2의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category2_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리2의 모집인원', nullable: true })
  category2Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리3의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category3_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리3의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category3_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리3의 모집인원', nullable: true })
  category3Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리4의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category4_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리4의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category4_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리4의 모집인원', nullable: true })
  category4Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리5의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category5_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리5의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category5_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리5의 모집인원', nullable: true })
  category5Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리6의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category6_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리6의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category6_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리6의 모집인원', nullable: true })
  category6Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리7의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category7_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리7의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category7_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리7의 모집인원', nullable: true })
  category7Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리8의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category8_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리8의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category8_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리8의 모집인원', nullable: true })
  category8Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리9의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category9_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리9의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category9_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리9의 모집인원', nullable: true })
  category9Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category10_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category10_2: ECategory2 | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 모집인원',
    nullable: true,
  })
  category10Number: number | null;
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

  @ApiProperty({ description: '프로젝트 정보 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '프로젝트 삭제일' })
  deletedAt: Date | null;

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
    example: 'DEVELOPER/DESIGN/ETC',
  })
  recruitCategory: string;

  @ApiProperty({
    description: '프로젝트 모집 하위카테고리',
    example: 'DEV_BE/DEV_FE/DESIGN_UX/DESIGN_ETC',
  })
  recruitSubCategory: string;

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
    description: '프로젝트 카테고리1의 카테고리1',
    enum: ECategory1,
  })
  category1_1: ECategory1;

  @ApiProperty({
    description: '프로젝트 카테고리1의 카테고리2',
    enum: ECategory2,
  })
  category1_2: ECategory2;

  @ApiProperty({ description: '프로젝트 카테고리1의 모집인원' })
  category1Number: number;

  @ApiProperty({
    description: '프로젝트 카테고리2의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category2_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리2의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category2_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리2의 모집인원', nullable: true })
  category2Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리3의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category3_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리3의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category3_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리3의 모집인원', nullable: true })
  category3Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리4의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category4_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리4의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category4_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리4의 모집인원', nullable: true })
  category4Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리5의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category5_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리5의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category5_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리5의 모집인원', nullable: true })
  category5Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리6의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category6_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리6의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category6_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리6의 모집인원', nullable: true })
  category6Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리7의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category7_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리7의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category7_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리7의 모집인원', nullable: true })
  category7Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리8의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category8_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리8의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category8_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리8의 모집인원', nullable: true })
  category8Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리9의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category9_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리9의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category9_2: ECategory2 | null;

  @ApiProperty({ description: '프로젝트 카테고리9의 모집인원', nullable: true })
  category9Number: number | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 카테고리1',
    nullable: true,
    enum: ECategory1,
  })
  category10_1: ECategory1 | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 카테고리2',
    nullable: true,
    enum: ECategory2,
  })
  category10_2: ECategory2 | null;

  @ApiProperty({
    description: '프로젝트 카테고리10의 모집인원',
    nullable: true,
  })
  category10Number: number | null;

  @ApiProperty({
    description: '프로젝트를 등록한 사용자 정보',
  })
  user: GetUserResDto;

  @ApiProperty({
    description: '프로젝트 모집자가 선택한 프로필 정보',
    type: CreateProfileDto,
  })
  profile: CreateProfileDto;
}
