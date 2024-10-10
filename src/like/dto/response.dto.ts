import { ApiProperty } from '@nestjs/swagger';

export class LikeResDto {
  @ApiProperty({
    description: '짬 결과>true',
  })
  result: boolean;
}

export class UnLikeResDto {
  @ApiProperty({
    description: '찜 해지 결과>true',
  })
  result: boolean;
}
