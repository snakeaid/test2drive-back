import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { coreModules } from './core/core.modules';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [...coreModules, ScheduleModule.forRoot(), LoggerModule],
})
export class AppModule {}
