import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';
import _ from 'lodash';

export const NTPropertyParam = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return _.get(req, `properties.${field}`);
  },
);
