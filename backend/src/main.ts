import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors({
    origin: configService.get('app.corsOrigins'),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix(configService.get('app.apiPrefix')!);

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('StoryVerse API')
    .setDescription('Interactive storytelling platform backend API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management and profiles')
    .addTag('Stories', 'Story management and content')
    .addTag('Gameplay', 'Interactive gameplay and progression')
    .addTag('Inventory', 'User resources and items')
    .addTag('Payment', 'In-app purchases and transactions')
    .addTag('Health', 'Application health and monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'StoryVerse API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
  });

  const port = configService.get('app.port');
  await app.listen(port);
  
  console.log(`🚀 StoryVerse Backend is running on: http://localhost:${port}/${configService.get('app.apiPrefix')}`);
  console.log(`📚 API Documentation (Swagger): http://localhost:${port}/api`);
  console.log(`💚 Health Check: http://localhost:${port}/${configService.get('app.apiPrefix')}/health`);
}
bootstrap();
