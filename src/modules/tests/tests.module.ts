import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { Test } from './entities/test.entity';
import { TestQuestion } from './entities/test-question.entity';
import { TestSession } from './entities/test-session.entity';
import { TestSessionAnswer } from './entities/test-session-answer.entity';
import { TestResult } from './entities/test-result.entity';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Test,
      TestQuestion,
      TestSession,
      TestSessionAnswer,
      TestResult,
    ]),
    QuestionsModule,
  ],
  controllers: [TestsController],
  providers: [TestsService],
  exports: [TestsService],
})
export class TestsModule {} 