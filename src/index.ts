import { INestApplication, VersioningType } from '@nestjs/common';
import {
  NTClassSerializerInterceptor,
  NTWrapperInterceptor,
} from './interceptors';
import { NTSetupSwaggerOptions, setupNTSwagger } from './tools';

import { Reflector } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { NTNotFoundFilter } from './filters';
import { NTvalidationPipe } from './pipes';

export * from '@nestjs/common';
export * from '@nestjs/core';
export * from '@nestjs/platform-express';
export * from '@nestjs/schedule';
export * from '@nestjs/swagger';
export * from '@nestjs/typeorm';
export { Transform } from 'class-transformer';
export * from 'nestjs-swagger-dto';

export * from './app';
export * from './decorators';
export * from './dto';
export * from './middlewares';
export * from './tools';

export interface NTSetupOptions {
  swagger?: NTSetupSwaggerOptions;
}

export async function setupNestjsTools(
  app: INestApplication,
  options?: NTSetupOptions,
) {
  app.enableCors();
  app.use(compression());

  const reflector = app.get(Reflector);
  app.useGlobalPipes(NTvalidationPipe());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.useGlobalInterceptors(new NTWrapperInterceptor());
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalInterceptors(new NTClassSerializerInterceptor(reflector));
  app.useGlobalFilters(new NTNotFoundFilter());

  await setupNTSwagger(app, options?.swagger);
}
