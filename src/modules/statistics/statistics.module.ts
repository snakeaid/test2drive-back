import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { QuestionAttempt } from '../questions/entities/question-attempt.entity';
import { Question } from '../questions/entities/question.entity';
import { QuestionCategory } from '../questions/entities/question-category.entity';
import { Lecture } from '../lectures/entities/lecture.entity';
import { LectureProgress } from '../lectures/entities/lecture-progress.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionAttempt,
      Question,
      QuestionCategory,
      Lecture,
      LectureProgress,
      User,
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
