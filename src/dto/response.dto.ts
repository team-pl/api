import { ApiProperty } from '@nestjs/swagger';
export class ListResponseDto<TItem> {
  @ApiProperty({ required: true })
  page: number;

  @ApiProperty({ required: true })
  total: number;

  @ApiProperty({ required: true })
  list: TItem[];
}
