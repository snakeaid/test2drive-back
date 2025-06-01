import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerService } from './modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const loggerService = await app.resolve(LoggerService);

  app.useLogger(loggerService);
  loggerService.setContext('bootstrap');
  loggerService.toScopeLogger().log(`${loggerService.service} started`);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Test2Drive API')
    .setDescription('API documentation for Test2Drive - система для вивчення правил дорожнього руху')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controllers
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Enable CORS for development
  app.enableCors({
    origin: process.env.NODE_ENV === 'development' ? '*' : false,
    credentials: true,
  });

  const port = process.env.PORT || 5001;
  await app.listen(port);
  
  loggerService.toScopeLogger().log(`Application is running on: http://localhost:${port}`);
  loggerService.toScopeLogger().log(`Swagger documentation available at: http://localhost:${port}/api-docs`);
}
bootstrap();
