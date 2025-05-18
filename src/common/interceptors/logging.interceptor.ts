import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const method = request.method;
    const url = request.url;

    this.logger.log(`Incoming request - ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const response = httpContext.getResponse<Response>();
        const statusCode = response.statusCode;
        const responseTime = Date.now() - now;
        this.logger.log(
          `Outgoing response - ${method} ${url} - ${statusCode} ${responseTime}ms`,
        );
      }),
    );
  }
}
