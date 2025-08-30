import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get application welcome message' })
  @ApiResponse({
    status: 200,
    description: 'Welcome message with API information',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Welcome to StoryVerse API' },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'development' },
        timestamp: { type: 'string', format: 'date-time' },
        endpoints: {
          type: 'object',
          properties: {
            documentation: { type: 'string', example: '/api' },
            health: { type: 'string', example: '/api/v1/health' },
          },
        },
      },
    },
  })
  getHello() {
    return this.appService.getHello();
  }
}
