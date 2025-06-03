import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { coreModules } from './core/core.modules';
import { LoggerModule } from './modules/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LecturesModule } from './modules/lectures/lectures.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { TestsModule } from './modules/tests/tests.module';
import { ExamsModule } from './modules/exams/exams.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    ...coreModules,
    ScheduleModule.forRoot(),
    LoggerModule,
    AuthModule,
    UsersModule,
    LecturesModule,
    QuestionsModule,
    TestsModule,
    ExamsModule,
    StatisticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
