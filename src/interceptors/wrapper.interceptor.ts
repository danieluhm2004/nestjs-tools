import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

import { globalOpcode } from '../tools/opcode';

@Injectable()
export class NTWrapperInterceptor implements NestInterceptor {
  private readonly logger = new Logger(NTWrapperInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const pipe = map((data: any) => ({ opcode: 0, ...data }));
    context.switchToHttp().getResponse().status(200);
    const errorPipe = catchError((err) => {
      if (err.name !== 'HttpException') {
        this.logger.error(err.message, err.stack);
        return throwError(() => globalOpcode.InvalidError({}, err));
      }

      return throwError(() => err);
    });

    return next.handle().pipe(errorPipe).pipe(pipe);
  }
}
