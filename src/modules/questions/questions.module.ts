import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionCategory } from './entities/question-category.entity';
import { Question } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
import { QuestionAttempt } from './entities/question-attempt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionCategory,
      Question,
      QuestionOption,
      QuestionAttempt,
    ]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {} 