import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerService } from './modules/logger/logger.service';

async function bootstrap() {
  try {
    console.log('🚀 Starting Test2Drive application...');
    console.log('📍 Environment:', process.env.NODE_ENV);
    console.log('🚪 Port:', process.env.PORT || 5001);
    console.log('🔐 Database Host:', process.env.DB_HOST || 'not set');
    console.log('⚡ Redis Host:', process.env.REDIS_HOST || 'not set');

    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    console.log('✅ NestJS app created successfully');

    const loggerService = await app.resolve(LoggerService);
    console.log('✅ Logger service resolved');

    app.useLogger(loggerService);
    loggerService.setContext('bootstrap');
    loggerService.toScopeLogger().log(`${loggerService.service} started`);

    // Swagger Configuration
    console.log('📚 Setting up Swagger documentation...');
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
        'JWT-auth',
      )
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('lectures', 'Lectures and categories endpoints')
      .addTag('questions', 'Questions and answer submission endpoints')
      .addTag('tests', 'Tests, sessions, and results endpoints')
      .addTag('exams', 'Official exams with stricter rules and validation')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    console.log('✅ Swagger setup complete');

    // Enable CORS
    console.log('🌐 Configuring CORS...');
    app.enableCors({
      origin: process.env.NODE_ENV === 'development' ? '*' : true,
      credentials: true,
    });
    console.log('✅ CORS configured');

    const port = process.env.PORT || 5001;
    console.log(`🚀 Starting server on port ${port}...`);
    
    await app.listen(port, '0.0.0.0');
    
    console.log(`🎉 Application is running on: http://0.0.0.0:${port}`);
    console.log(`📚 Swagger documentation available at: http://0.0.0.0:${port}/api-docs`);
    
    loggerService.toScopeLogger().log(`Application is running on port ${port}`);
    loggerService.toScopeLogger().log(`Swagger documentation available at: /api-docs`);
  } catch (error) {
    console.error('💥 Application failed to start:', error);
    console.error('📊 Error stack:', error.stack);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('💥 Bootstrap failed:', error);
  process.exit(1);
});
