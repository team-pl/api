import { ApiProperty } from '@nestjs/swagger';
import { GetApplyProfileResDto } from 'src/profile/dto/response.dto';
import { EApplyState } from 'src/type/apply.type';

export class PostApplyResDto {
  @ApiProperty({ description: '프로젝트 지원 ID' })
  id: string;
}

export class CheckApplyResDto {
  @ApiProperty({ description: '프로젝트 확인완료 결과' })
  result: boolean;
}

export class ConfirmApplyResDto {
  @ApiProperty({ description: '프로젝트 참여확정 결과' })
  result: boolean;
}

export class CancelApplyResDto {
  @ApiProperty({ description: '프로젝트 확정취소 결과' })
  result: boolean;
}

export class RejectApplyResDto {
  @ApiProperty({ description: '프로젝트 거절 결과' })
  result: boolean;
}

export class GetApplicantResDto {
  @ApiProperty({ description: '프로젝트 지원 ID' })
  id: string;

  @ApiProperty({ description: '프로젝트 지원일' })
  createdAt: Date;

  @ApiProperty({
    description: '지원한 사용자 ID',
  })
  userId: string;

  @ApiProperty({
    description: '지원한 프로필 ID',
  })
  profileId: string;

  @ApiProperty({
    description: '지원 상태',
  })
  state: EApplyState;
}

export class GetApplicantsResDto {
  @ApiProperty({ description: '지원자 목록', isArray: true })
  list: GetApplicantResDto;
}

export class GetDetailResDto {
  @ApiProperty({ description: '사용자가 입력한 지원 내용' })
  details: string;

  @ApiProperty({ description: '사용자가 프로젝트 지원시 사용한 프로필 데이터' })
  profile: GetApplyProfileResDto;
}
