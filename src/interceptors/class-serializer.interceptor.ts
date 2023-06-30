import {
  CallHandler,
  ClassSerializerContextOptions,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
  StreamableFile,
} from '@nestjs/common';
import { TransformerPackage } from '@nestjs/common/interfaces/external/transformer-package.interface';
import { CLASS_SERIALIZER_OPTIONS } from '@nestjs/common/serializer/class-serializer.constants';
import {
  ClassTransformOptions,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import _, { isObject } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PlainLiteralObject {
  [key: string]: any;
}

// NOTE (external)
// We need to deduplicate them here due to the circular dependency
// between core and common packages
const REFLECTOR = 'Reflector';

/**
 * @publicApi
 */
export interface ClassSerializerInterceptorOptions
  extends ClassTransformOptions {
  transformerPackage?: TransformerPackage;
}

/**
 * @publicApi
 */
@Injectable()
export class NTClassSerializerInterceptor implements NestInterceptor {
  constructor(
    @Inject(REFLECTOR) protected readonly reflector: any,
    @Optional()
    protected readonly defaultOptions: ClassSerializerInterceptorOptions = {},
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this.getContextOptions(context);
    const options = {
      ...this.defaultOptions,
      ...contextOptions,
    };

    const req = context.switchToHttp().getRequest();
    options.groups = [
      ...(options.groups || []),
      _.get(req, 'properties.session.user.isAdmin') === true
        ? 'role:admin'
        : 'role:user',
    ];

    return next
      .handle()
      .pipe(
        map((res: PlainLiteralObject | Array<PlainLiteralObject>) =>
          this.serialize(res, options),
        ),
      );
  }

  /**
   * Serializes responses that are non-null objects nor streamable files.
   */
  serialize(
    response: PlainLiteralObject | Array<PlainLiteralObject>,
    options: ClassSerializerContextOptions,
  ): PlainLiteralObject | Array<PlainLiteralObject> {
    if (!isObject(response) || response instanceof StreamableFile) {
      return response;
    }

    return Array.isArray(response)
      ? response.map((item) => this.transformToPlain(item, options))
      : this.transformToPlain(response, options);
  }

  transformToPlain(
    plainOrClass: any,
    options: ClassSerializerContextOptions,
  ): PlainLiteralObject {
    if (!plainOrClass) return plainOrClass;
    if (!options.type) return instanceToPlain(plainOrClass, options);
    if (plainOrClass instanceof options.type) {
      return instanceToPlain(plainOrClass, options);
    }

    const instance = plainToInstance(options.type, plainOrClass);
    return instanceToPlain(instance, options);
  }

  protected getContextOptions(
    context: ExecutionContext,
  ): ClassSerializerContextOptions | undefined {
    return this.reflector.getAllAndOverride(CLASS_SERIALIZER_OPTIONS, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
