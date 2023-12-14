import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { INestApplication } from '@nestjs/common';
import expressBasicAuth from 'express-basic-auth';
import { NTAppService } from '../app/app.service';
import { ResClusterInfoDto } from '../dto/clusterInfo.dto';
import { OpcodeItem } from './opcode';

export interface NTSetupSwaggerOptions {
  opcode?: { [key: string]: OpcodeItem };
  auth?: { username: string; password: string };
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
  app.use('/docs*', getAuthMiddleware(options));
  app.use('/docs/swagger.json', (_, res) => res.send(document));
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}

function getAuthMiddleware(options?: NTSetupSwaggerOptions) {
  const username = options?.auth?.username || 'admin';
  const password = options?.auth?.password || 'admin';
  return expressBasicAuth({
    challenge: true,
    users: { [username]: password },
  });
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
