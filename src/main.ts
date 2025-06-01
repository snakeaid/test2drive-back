import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const loggerService = await app.resolve(LoggerService);

  app.useLogger(loggerService);
  loggerService.setContext('bootstrap');
  loggerService.toScopeLogger().log(`${loggerService.service} started`);

  await app.listen(5001);
}
bootstrap();
