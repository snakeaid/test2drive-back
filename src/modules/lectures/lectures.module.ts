import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { LectureCategory } from './entities/lecture-category.entity';
import { Lecture } from './entities/lecture.entity';
import { LectureProgress } from './entities/lecture-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureCategory,
      Lecture,
      LectureProgress,
    ]),
  ],
  controllers: [LecturesController],
  providers: [LecturesService],
  exports: [LecturesService],
})
export class LecturesModule {} 