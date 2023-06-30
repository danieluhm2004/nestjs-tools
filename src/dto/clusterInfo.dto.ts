import { IsEnum, IsString } from 'nestjs-swagger-dto';

export const clusterMode = ['prd', 'stg', 'dev'] as const;
export type ClusterMode = (typeof clusterMode)[number];

export class ResClusterInfoDto {
  @IsString({
    description: '프로젝트 이름',
    example: 'backend',
  })
  name: string;

  @IsString({
    description: '프로젝트 버전',
    example: '1.0.0',
  })
  version: string;

  @IsEnum({
    enum: { clusterMode } as any,
    description: '배포 모드',
    example: clusterMode[0],
  })
  mode: ClusterMode;

  @IsString({
    description: '프로젝트 설명',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  })
  description: string;

  @IsString({ description: '클러스터 이름', example: '169.254.169.254' })
  hostname: string;

  @IsString({
    description: '작성자',
    example: 'danieluhm2004 <iam@dan.al>',
  })
  author: string;
}
