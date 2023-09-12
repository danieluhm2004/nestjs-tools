import { ValidationPipe } from '@nestjs/common';
import { globalOpcode } from '../tools/opcode';

export const NTvalidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (details) => globalOpcode.ValidateFailed({ details }),
    transformOptions: {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      groups: ['flag:request'],
    },
  });
