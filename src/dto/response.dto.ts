import { IsNumber } from 'nestjs-swagger-dto';

export class ResponseDto {
  @IsNumber({ description: '상태 코드', example: 0 })
  opcode: number;
}
