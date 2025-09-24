import { ConfigService } from "@nestjs/config";

export const throttlerConfig = (configService: ConfigService) => [
  {
    ttl: configService.get<number>('THROTTLE_TTL') ?? 60,
    limit: configService.get<number>('THROTTLE_LIMIT') ?? 5,
  }
]