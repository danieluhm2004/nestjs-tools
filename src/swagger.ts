import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { INestApplication } from '@nestjs/common';
import { NTAppService } from './app/app.service';
import { OpcodeItem } from './opcode';
import { ResClusterInfoDto } from './dto/clusterInfo.dto';

export interface NTSetupSwaggerOptions {
  opcode?: { [key: string]: OpcodeItem };
  tags?: {
    name: string;
    description: string;
  }[];
}

export async function setupNTSwagger(
  app: INestApplication,
  options?: NTSetupSwaggerOptions,
) {
  const clusterInfo = await new NTAppService().getClusterInfo();
  const config = new DocumentBuilder()
    .setTitle(clusterInfo.name)
    .setDescription(getDescription(clusterInfo, options?.opcode))
    .setVersion(clusterInfo.version)
    .addTag('System', '시스템과 관련된 것들을 처리합니다.')
    .addBearerAuth({
      description: '인증 토큰',
      name: 'Authorization',
      type: 'http',
      in: 'Header',
    });

  if (options?.tags) {
    for (const tag of options.tags) {
      config.addTag(tag.name, tag.description);
    }
  }

  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('docs', app, document);
}

function getDescription(
  clusterInfo: ResClusterInfoDto,
  opcode?: NTSetupSwaggerOptions['opcode'],
) {
  let { description } = clusterInfo;
  if (!opcode) return description;

  description += '<br/>';
  for (const [type, error] of Object.entries(opcode)) {
    const { response, message, status }: any = error();
    description += `<br/><b>${response.opcode} (${type})</b> / ${status} ${message}`;
  }

  return description;
}
