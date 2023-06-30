import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { NTApiResponse } from '../decorators';
import { NTAppService } from './app.service';
import { ResClusterInfoDto } from '../dto/clusterInfo.dto';

@ApiTags('System')
@Controller({ version: VERSION_NEUTRAL })
export class NTAppController {
  constructor(private readonly appService: NTAppService) {}

  @Get()
  @NTApiResponse(ResClusterInfoDto)
  getClusterInfo() {
    return this.appService.getClusterInfoFromCache();
  }
}
