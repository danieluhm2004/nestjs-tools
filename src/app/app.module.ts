import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { NTAppController } from './app.controller';
import { NTAppService } from './app.service';
import { NTLoggerMiddleware } from '../middlewares';

@Module({
  controllers: [NTAppController],
  providers: [NTAppService],
  exports: [NTAppService],
})
export class NTAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NTLoggerMiddleware).forRoutes('*');
  }
}
