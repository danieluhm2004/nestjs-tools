import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { NTLoggerMiddleware } from '../middlewares';
import { NTAppController } from './app.controller';
import { NTAppService } from './app.service';

const imports = [];

if (process.env.IS_SCHEDULER === 'true') {
  imports.push(ScheduleModule.forRoot());
}

@Module({
  controllers: [NTAppController],
  providers: [NTAppService],
  exports: [NTAppService],
  imports,
})
export class NTAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NTLoggerMiddleware).forRoutes('*');
  }
}
