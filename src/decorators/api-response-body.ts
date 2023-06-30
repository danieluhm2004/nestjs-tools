import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseSchemaHost,
  getSchemaPath,
} from '@nestjs/swagger';
import { Type, applyDecorators } from '@nestjs/common';

import { ResponseDto } from '../dto/response.dto';

export const NTApiResponse = <T extends Type<any>>(dto: T) => {
  const schema: ApiResponseSchemaHost['schema'] = { allOf: [] };
  schema.allOf.push({ $ref: getSchemaPath(ResponseDto) });
  schema.allOf.push({ $ref: getSchemaPath(dto) });
  return applyDecorators(
    ApiOkResponse({ schema }),
    ApiExtraModels(dto, ResponseDto),
  );
};
