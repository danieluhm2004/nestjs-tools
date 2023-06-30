import { ClusterMode, ResClusterInfoDto } from '../dto/clusterInfo.dto';
import { Injectable, Logger } from '@nestjs/common';

import _ from 'lodash';
import os from 'os';

@Injectable()
export class NTAppService {
  private readonly logger = new Logger(NTAppService.name);
  private clusterInfo: ResClusterInfoDto;
  public DisplayMode = {
    dev: 'Development Mode',
    stg: 'Staging Mode',
    prd: 'Production Mode',
  };

  async onModuleInit() {
    const clusterInfo = await this.getClusterInfo();
    this.logger.log(`Package name: ${clusterInfo.name}`);
    this.logger.log(`Package version: ${clusterInfo.version}`);
    this.logger.log(`Package description: ${clusterInfo.description}`);
    this.logger.log(`Package author: ${clusterInfo.author}`);
    this.logger.log(`Cluster name: ${clusterInfo.hostname}`);
    this.logger.log(`Cluster mode: ${this.DisplayMode[clusterInfo.mode]}`);
    this.clusterInfo = clusterInfo;
  }

  async getClusterInfo(): Promise<ResClusterInfoDto> {
    if (this.clusterInfo) return this.clusterInfo;
    const packageFile = await import(`${process.cwd()}/package.json`);
    const packageJson = _.pick(
      packageFile,
      'name',
      'version',
      'description',
      'author',
    );

    const hostname = os.hostname();
    const mode = (process.env.NODE_ENV as ClusterMode) || 'prd';
    return { ...packageJson, hostname, mode };
  }

  getClusterInfoFromCache(): ResClusterInfoDto {
    return this.clusterInfo;
  }
}
