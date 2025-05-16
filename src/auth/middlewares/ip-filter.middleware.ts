import { Injectable, Logger, type NestMiddleware } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Request, Response, NextFunction } from "express"

@Injectable()
export class IpFilterMiddleware implements NestMiddleware {
  private readonly logger = new Logger(IpFilterMiddleware.name);
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = this.getClientIp(req)
    const allowedIpPattern = this.configService.get<string>("ALLOWED_IP_PATTERN") || "192.168.1.*"

    const regexPattern = this.convertWildcardToRegex(allowedIpPattern)
    this.logger.log(`Incoming request - ${req.method} ${req.url} - IP: ${clientIp}`);
    if (!clientIp.match(regexPattern)) {
      this.logger.error(`Outgoing response - ${req.method} ${req.url} - IP: ${clientIp} - 403 Forbidden`);
      return res.status(403).json({
        statusCode: 403,
        message: "Acceso prohibido: IP no autorizada: " + clientIp,
      })
    }

    next()
  }

  private getClientIp(request: Request): string {
    const xForwardedFor = request.headers["x-forwarded-for"]
    if (xForwardedFor) {
      return Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor.split(",")[0].trim()
    }

    return (request.headers["x-real-ip"] as string) || request.connection.remoteAddress || "0.0.0.0"
  }

  private convertWildcardToRegex(pattern: string): RegExp {
    const escapedPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*")

    return new RegExp(`^${escapedPattern}$`)
  }
}
