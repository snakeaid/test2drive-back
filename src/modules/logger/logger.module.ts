import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ScopeLogger } from './scope-logger';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [LoggerService, ScopeLogger],
  exports: [LoggerService, ScopeLogger],
})
export class LoggerModule {}
