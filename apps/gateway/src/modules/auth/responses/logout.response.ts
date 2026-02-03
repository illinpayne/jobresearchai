import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponse {
  @ApiProperty({ example: 200 })
  status: number;
}
