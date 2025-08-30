import { registerAs } from '@nestjs/config';

export const appConfig = registerAs(
  'app',
  () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api/v1',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ],
    rateLimit: {
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10),
      limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },
  }),
);
