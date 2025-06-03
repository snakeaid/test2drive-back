import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionAttempt } from '../questions/entities/question-attempt.entity';
import { QuestionCategory } from '../questions/entities/question-category.entity';
import { Question } from '../questions/entities/question.entity';
import { Lecture } from '../lectures/entities/lecture.entity';
import { LectureProgress } from '../lectures/entities/lecture-progress.entity';
import { User } from '../users/entities/user.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(QuestionAttempt)
    private attemptRepo: Repository<QuestionAttempt>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(QuestionCategory)
    private categoryRepo: Repository<QuestionCategory>,
    @InjectRepository(Lecture)
    private lectureRepo: Repository<Lecture>,
    @InjectRepository(LectureProgress)
    private lectureProgressRepo: Repository<LectureProgress>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly cacheService: CacheService,
  ) {}

  async getUserStatistics(userId: string) {
    const cacheKey = `stats:tests:${userId}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const attempts = await this.attemptRepo.find({
      where: { userId },
      relations: ['question', 'question.category'],
    });

    const statsMap = new Map<string, { total: number; correct: number; categoryName: string }>();

    for (const attempt of attempts) {
      const catId = attempt.question.category.id;
      const catName = attempt.question.category.name;

      if (!statsMap.has(catId)) {
        statsMap.set(catId, { total: 0, correct: 0, categoryName: catName });
      }

      const stat = statsMap.get(catId)!;
      stat.total += 1;
      if (attempt.isCorrect) stat.correct += 1;
    }

    const result = Array.from(statsMap.entries()).map(([categoryId, stat]) => ({
      categoryId,
      categoryName: stat.categoryName,
      total: stat.total,
      correct: stat.correct,
      correctPercentage: Number(((stat.correct / stat.total) * 100).toFixed(1)),
    }));

    await this.cacheService.set(cacheKey, result, 0, 86400); // 1 день
    return result;
  }

  async getLectureProgress(userId: string) {
    const cacheKey = `stats:lectures:${userId}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const totalLectures = await this.lectureRepo.count();
    const viewedLectures = await this.lectureProgressRepo.count({ where: { userId } });

    const result = {
      totalLectures,
      viewedLectures,
      percentage: totalLectures > 0 ? Math.round((viewedLectures / totalLectures) * 100) : 0,
    };

    await this.cacheService.set(cacheKey, result, 0, 86400);
    return result;
  }

  async getSummary(userId: string) {
    const cacheKey = `stats:summary:${userId}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const totalQuestions = await this.questionRepo.count();
    const userAttempts = await this.attemptRepo.count({ where: { userId } });

    const totalLectures = await this.lectureRepo.count();
    const viewedLectures = await this.lectureProgressRepo.count({ where: { userId } });

    const result = {
      totalQuestions,
      userAttempts,
      totalLectures,
      viewedLectures,
      questionCoverage: totalQuestions > 0 ? Math.round((userAttempts / totalQuestions) * 100) : 0,
      lectureCoverage: totalLectures > 0 ? Math.round((viewedLectures / totalLectures) * 100) : 0,
    };

    await this.cacheService.set(cacheKey, result, 0, 86400);
    return result;
  }
}
