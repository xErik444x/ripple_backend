import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Replace unsafe any usage with proper typing
    // For example:
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.get('authorization') as
      | string
      | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      this.logger.error(
        `Outgoing response - ${request.method} ${request.url} - 401 Unauthorized`,
      );
      throw new UnauthorizedException('Token de API no proporcionado');
    }

    if (!authHeader) {
      throw new UnauthorizedException('Token de API no proporcionado');
    }
    const token = authHeader.split(' ')[1];
    const apiKey = this.configService.get<string>('API_KEY');

    if (!apiKey || token !== apiKey) {
      this.logger.error(
        `Outgoing response - ${request.method} ${request.url} - 401 Unauthorized`,
      );
      throw new UnauthorizedException('Token de API inválido');
    }

    return true;
  }
}
