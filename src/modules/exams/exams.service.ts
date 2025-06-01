import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { TestsService } from '../tests/tests.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AnswerTestQuestionDto } from '../tests/dto/answer-test-question.dto';
import { TestType } from '../tests/entities/test.entity';
import { CreateTestDto } from '../tests/dto/create-test.dto';

@Injectable()
export class ExamsService {
  constructor(private readonly testsService: TestsService) {}

  // Exam CRUD methods - delegate to TestsService with exam constraints
  async createExam(createExamDto: CreateExamDto) {
    // Validate exam-specific constraints
    if (createExamDto.questions.length < 10) {
      throw new BadRequestException('Exams must have at least 10 questions');
    }

    if (createExamDto.questions.length > 40) {
      throw new BadRequestException('Exams cannot have more than 40 questions');
    }

    // Convert to test DTO with exam defaults
    const createTestDto: CreateTestDto = {
      ...createExamDto,
      type: TestType.EXAM,
      passingScorePercentage: createExamDto.passingScorePercentage ?? 75,
      allowRetries: createExamDto.allowRetries ?? false,
      showResultsImmediately: createExamDto.showResultsImmediately ?? false,
      sortOrder: createExamDto.sortOrder ?? 0,
    };

    return this.testsService.createTest(createTestDto);
  }

  async findAllExams(includeUnpublished = false) {
    return this.testsService.findTestsByType(TestType.EXAM, includeUnpublished);
  }

  async findExamById(id: string) {
    const exam = await this.testsService.findTestById(id);
    
    if (exam.type !== TestType.EXAM) {
      throw new BadRequestException('Test is not an exam');
    }

    return exam;
  }

  async updateExam(id: string, updateExamDto: UpdateExamDto) {
    // Ensure we're updating an exam
    const exam = await this.findExamById(id);

    // Validate exam-specific constraints if questions are being updated
    if (updateExamDto.questions) {
      if (updateExamDto.questions.length < 10) {
        throw new BadRequestException('Exams must have at least 10 questions');
      }

      if (updateExamDto.questions.length > 40) {
        throw new BadRequestException('Exams cannot have more than 40 questions');
      }
    }

    // Convert to test update DTO
    const updateTestDto = {
      ...updateExamDto,
      type: TestType.EXAM, // Ensure type cannot be changed
    };

    return this.testsService.updateTest(id, updateTestDto);
  }

  async removeExam(id: string) {
    // Ensure we're removing an exam
    await this.findExamById(id);
    return this.testsService.removeTest(id);
  }

  // Exam session methods - delegate to TestsService with additional validation
  async startExam(userId: string, examId: string) {
    const exam = await this.findExamById(examId);

    // Additional exam-specific validations
    if (!exam.timeLimitMinutes) {
      throw new BadRequestException('Exam must have a time limit');
    }

    if (!exam.isPublished) {
      throw new ForbiddenException('Exam is not published');
    }

    // Check if user already has a completed exam (if retries not allowed)
    if (!exam.allowRetries) {
      const existingResults = await this.testsService.getTestResults(examId);
      const userResult = existingResults.find(result => result.userId === userId);
      
      if (userResult) {
        throw new ForbiddenException('You have already completed this exam. Retries are not allowed.');
      }
    }

    return this.testsService.startTest(userId, examId);
  }

  async getActiveExamSession(userId: string, examId: string) {
    // Ensure it's an exam
    await this.findExamById(examId);
    return this.testsService.getActiveSession(userId, examId);
  }

  async getCurrentExamQuestion(userId: string, examId: string) {
    // Ensure it's an exam
    await this.findExamById(examId);
    return this.testsService.getCurrentQuestion(userId, examId);
  }

  async answerExamQuestion(userId: string, examId: string, answerDto: AnswerTestQuestionDto) {
    // Ensure it's an exam
    await this.findExamById(examId);
    return this.testsService.answerQuestion(userId, examId, answerDto);
  }

  async completeExam(sessionId: string) {
    return this.testsService.completeTest(sessionId);
  }

  // Exam results methods
  async getUserExamResults(userId: string) {
    const allResults = await this.testsService.getUserResults(userId);
    // Filter to only exam results
    return allResults.filter(result => result.test.type === TestType.EXAM);
  }

  async getExamResults(examId: string) {
    // Ensure it's an exam
    await this.findExamById(examId);
    return this.testsService.getTestResults(examId);
  }

  async getExamResultById(id: string) {
    const result = await this.testsService.getResultById(id);
    
    if (result.test.type !== TestType.EXAM) {
      throw new BadRequestException('Result is not for an exam');
    }

    return result;
  }

  // Exam-specific statistics
  async getExamStatistics(examId: string) {
    const exam = await this.findExamById(examId);
    const results = await this.getExamResults(examId);

    const totalAttempts = results.length;
    const passedAttempts = results.filter(r => r.isPassed).length;
    const averageScore = totalAttempts > 0 
      ? results.reduce((sum, r) => sum + r.scorePercentage, 0) / totalAttempts 
      : 0;
    const averageTime = totalAttempts > 0
      ? results.reduce((sum, r) => sum + r.timeSpentSeconds, 0) / totalAttempts
      : 0;

    return {
      examId: exam.id,
      examTitle: exam.title,
      totalAttempts,
      passedAttempts,
      passRate: totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0,
      averageScore: Number(averageScore.toFixed(2)),
      averageTimeMinutes: Number((averageTime / 60).toFixed(2)),
      passingScorePercentage: exam.passingScorePercentage,
      timeLimitMinutes: exam.timeLimitMinutes,
    };
  }
} 