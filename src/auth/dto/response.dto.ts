import { ApiProperty } from '@nestjs/swagger';

export class LoginResDto {
  @ApiProperty({ description: 'token' })
  accessToken: string;
}
