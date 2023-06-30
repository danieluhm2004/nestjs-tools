import { IsNumber, IsObject, IsString } from 'nestjs-swagger-dto';

import { Transform } from 'class-transformer';

export class FindDto {
  @IsNumber({
    description: '가져올 갯수',
    example: 10,
    optional: true,
    min: 0,
    max: 100,
  })
  take?: number = 10;

  @IsNumber({
    description: '넘길 갯수',
    example: 0,
    optional: true,
    min: 0,
  })
  skip?: number = 0;

  @IsString({
    description: '검색',
    optional: true,
  })
  search?: string;

  @IsObject({
    description: '우선순위',
    example: { createdAt: 'desc' },
    optional: true,
  })
  @Transform((e) => e.obj['order'])
  order?: {
    [key: string]: 'asc' | 'desc';
  } = { createdAt: 'desc' };
}
