import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  MongooseHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private mongo: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({
    status: 200,
    description: 'Health check passed',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        info: {
          type: 'object',
          properties: {
            database: { type: 'object' },
            mongodb: { type: 'object' },
            memory_heap: { type: 'object' },
            memory_rss: { type: 'object' },
            storage: { type: 'object' },
          },
        },
        error: { type: 'object' },
        details: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Health check failed',
  })
  @HealthCheck()
  check() {
    return this.health.check([
      // PostgreSQL Database Check
      () => this.db.pingCheck('database'),
      
      // MongoDB Check
      () => this.mongo.pingCheck('mongodb'),
      
      // Memory usage checks
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB limit
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // 300MB limit
      
      // Disk storage check
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9, // 90% threshold
        }),
    ]);
  }

  @Get('ready')
  @Public()
  @ApiOperation({ summary: 'Check if application is ready to serve traffic' })
  @ApiResponse({
    status: 200,
    description: 'Application is ready',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number' },
        environment: { type: 'string' },
        version: { type: 'string' },
      },
    },
  })
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.mongo.pingCheck('mongodb'),
    ]);
  }

  @Get('live')
  @Public()
  @ApiOperation({ summary: 'Check if application is alive' })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number' },
      },
    },
  })
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}
