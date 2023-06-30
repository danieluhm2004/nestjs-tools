import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class NTLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(NTLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const startedAt = Date.now();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const httpVersion = `HTTP/${req.httpVersionMajor}.${req.httpVersionMinor}`;
    const userAgent = req.headers['user-agent'];
    const ipAddress =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    if (!ipAddress) return next();
    res.on('finish', () => {
      const statusCode = res.statusCode;
      const contentLength = `${res.getHeader('content-length') || 0}B`;
      const time = `${Date.now() - startedAt}ms`;

      this.logger.log(
        `[${httpVersion}] ${method} ${url} - ${time}\
(SC: ${statusCode}, IP: "${ipAddress}", UA: "${userAgent}", CL: ${contentLength})`,
      );

      if (Object.keys(req.body).length > 0) {
        this.logger.log(`Request Body: ${JSON.stringify(req.body)}`);
      }
    });

    next();
  }
}
