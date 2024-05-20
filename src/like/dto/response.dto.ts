import { ApiProperty } from '@nestjs/swagger';

export class LikeResDto {
  @ApiProperty({
    description: '좋아요 클릭 결과>총 좋아요 수',
  })
  result: number;
}

export class UnLikeResDto {
  @ApiProperty({
    description: '좋아요 해지 결과>총 좋아요 수',
  })
  result: number;
}
