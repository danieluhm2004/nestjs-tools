import { INestApplication, VersioningType } from '@nestjs/common';
import { NTSetupSwaggerOptions, setupNTSwagger } from './swagger';

import { NTClassSerializerInterceptor } from './interceptors/class-serializer.interceptor';
import { NTNotFoundFilter } from './filters/notfound.filter';
import { NTWrapperInterceptor } from './interceptors/wrapper.interceptor';
import { NTvalidationPipe } from './pipes/validationPipe';
import { Reflector } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';

export * from '@nestjs/common';
export * from '@nestjs/core';
export * from '@nestjs/platform-express';
export * from '@nestjs/swagger';
export * from '@nestjs/typeorm';
export * from 'nestjs-swagger-dto';

export * from './app';
export * from './decorators';
export * from './dto';
export * from './middlewares';
export * from './opcode';

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
