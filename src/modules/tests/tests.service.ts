import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test, TestType } from './entities/test.entity';
import { TestQuestion } from './entities/test-question.entity';
import { TestSession, TestSessionStatus } from './entities/test-session.entity';
import { TestSessionAnswer } from './entities/test-session-answer.entity';
import { TestResult } from './entities/test-result.entity';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { AnswerTestQuestionDto } from './dto/answer-test-question.dto';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
    @InjectRepository(TestQuestion)
    private testQuestionRepository: Repository<TestQuestion>,
    @InjectRepository(TestSession)
    private testSessionRepository: Repository<TestSession>,
    @InjectRepository(TestSessionAnswer)
    private testSessionAnswerRepository: Repository<TestSessionAnswer>,
    @InjectRepository(TestResult)
    private testResultRepository: Repository<TestResult>,
    private questionsService: QuestionsService,
  ) {}

  // Test CRUD methods
  async createTest(createTestDto: CreateTestDto): Promise<Test> {
    // Validate questions exist and belong to category if specified
    const questionIds = createTestDto.questions.map(q => q.questionId);
    const questions = await this.questionsService.findAllQuestions(true);
    const validQuestions = questions.filter(q => questionIds.includes(q.id));

    if (validQuestions.length !== questionIds.length) {
      throw new BadRequestException('Some questions do not exist');
    }

    // Validate category filter if specified
    if (createTestDto.categoryId) {
      const categoryQuestions = validQuestions.filter(q => q.categoryId === createTestDto.categoryId);
      if (categoryQuestions.length !== validQuestions.length) {
        throw new BadRequestException('All questions must belong to the specified category');
      }
    }

    // Validate question orders are unique and sequential
    const orders = createTestDto.questions.map(q => q.questionOrder);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
      throw new BadRequestException('Question orders must be unique');
    }

    const test = this.testRepository.create({
      ...createTestDto,
      questionsCount: createTestDto.questions.length,
      testQuestions: createTestDto.questions.map(q => ({
        questionId: q.questionId,
        questionOrder: q.questionOrder,
        points: q.points || 1,
      })),
    });

    return this.testRepository.save(test);
  }

  async findAllTests(includeUnpublished = false): Promise<Test[]> {
    const whereCondition = includeUnpublished ? {} : { isPublished: true };
    
    return this.testRepository.find({
      where: whereCondition,
      relations: ['category', 'testQuestions', 'testQuestions.question'],
      order: { sortOrder: 'ASC', title: 'ASC' },
    });
  }

  async findTestsByType(type: TestType, includeUnpublished = false): Promise<Test[]> {
    const whereCondition = includeUnpublished 
      ? { type } 
      : { type, isPublished: true };

    return this.testRepository.find({
      where: whereCondition,
      relations: ['category', 'testQuestions', 'testQuestions.question'],
      order: { sortOrder: 'ASC', title: 'ASC' },
    });
  }

  async findTestById(id: string): Promise<Test> {
    const test = await this.testRepository.findOne({
      where: { id },
      relations: ['category', 'testQuestions', 'testQuestions.question', 'testQuestions.question.options'],
      order: { testQuestions: { questionOrder: 'ASC' } },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    return test;
  }

  async updateTest(id: string, updateTestDto: UpdateTestDto): Promise<Test> {
    const test = await this.findTestById(id);

    if (updateTestDto.questions) {
      // Remove existing test questions
      await this.testQuestionRepository.delete({ testId: id });
      
      // Validate new questions
      const questionIds = updateTestDto.questions.map(q => q.questionId);
      const questions = await this.questionsService.findAllQuestions(true);
      const validQuestions = questions.filter(q => questionIds.includes(q.id));

      if (validQuestions.length !== questionIds.length) {
        throw new BadRequestException('Some questions do not exist');
      }
    }

    Object.assign(test, updateTestDto);

    if (updateTestDto.questions) {
      test.questionsCount = updateTestDto.questions.length;
      test.testQuestions = updateTestDto.questions.map(q => ({
        testId: id,
        questionId: q.questionId,
        questionOrder: q.questionOrder,
        points: q.points || 1,
      })) as any;
    }

    return this.testRepository.save(test);
  }

  async removeTest(id: string): Promise<void> {
    const test = await this.findTestById(id);
    await this.testRepository.remove(test);
  }

  // Test session methods
  async startTest(userId: string, testId: string): Promise<TestSession> {
    const test = await this.findTestById(testId);

    if (!test.isPublished) {
      throw new ForbiddenException('Test is not published');
    }

    // Check if user has an active session for this test
    const activeSession = await this.testSessionRepository.findOne({
      where: { 
        userId, 
        testId, 
        status: TestSessionStatus.IN_PROGRESS 
      },
    });

    if (activeSession) {
      throw new ConflictException('You already have an active session for this test');
    }

    // Check if retries are allowed
    if (!test.allowRetries) {
      const existingResult = await this.testResultRepository.findOne({
        where: { userId, testId },
      });

      if (existingResult) {
        throw new ForbiddenException('Retries are not allowed for this test');
      }
    }

    const now = new Date();
    const expiresAt = test.timeLimitMinutes 
      ? new Date(now.getTime() + test.timeLimitMinutes * 60 * 1000)
      : null;

    const session = this.testSessionRepository.create({
      userId,
      testId,
      startedAt: now,
      expiresAt,
      status: TestSessionStatus.IN_PROGRESS,
      currentQuestionIndex: 0,
      timeSpentSeconds: 0,
    });

    return this.testSessionRepository.save(session);
  }

  async getActiveSession(userId: string, testId: string): Promise<TestSession> {
    const session = await this.testSessionRepository.findOne({
      where: { 
        userId, 
        testId, 
        status: TestSessionStatus.IN_PROGRESS 
      },
      relations: ['test', 'answers'],
    });

    if (!session) {
      throw new NotFoundException('No active session found for this test');
    }

    // Check if session has expired
    if (session.expiresAt && new Date() > session.expiresAt) {
      session.status = TestSessionStatus.EXPIRED;
      await this.testSessionRepository.save(session);
      throw new ForbiddenException('Test session has expired');
    }

    return session;
  }

  async getCurrentQuestion(userId: string, testId: string): Promise<{
    question: any;
    questionNumber: number;
    totalQuestions: number;
    timeRemaining?: number;
  }> {
    const session = await this.getActiveSession(userId, testId);
    const test = await this.findTestById(testId);

    if (session.currentQuestionIndex >= test.testQuestions.length) {
      throw new BadRequestException('All questions have been answered');
    }

    const currentTestQuestion = test.testQuestions[session.currentQuestionIndex];
    const question = currentTestQuestion.question;

    let timeRemaining: number | undefined;
    if (session.expiresAt) {
      timeRemaining = Math.max(0, Math.floor((session.expiresAt.getTime() - Date.now()) / 1000));
    }

    return {
      question: {
        id: question.id,
        questionText: question.questionText,
        questionImageUrl: question.questionImageUrl,
        difficulty: question.difficulty,
        options: question.options.map(option => ({
          id: option.id,
          optionLetter: option.optionLetter,
          optionText: option.optionText,
          // Don't expose isCorrect during the test
        })),
      },
      questionNumber: session.currentQuestionIndex + 1,
      totalQuestions: test.testQuestions.length,
      timeRemaining,
    };
  }

  async answerQuestion(userId: string, testId: string, answerDto: AnswerTestQuestionDto): Promise<{
    isLastQuestion: boolean;
    nextQuestionAvailable: boolean;
  }> {
    const session = await this.getActiveSession(userId, testId);
    const test = await this.findTestById(testId);

    if (session.currentQuestionIndex >= test.testQuestions.length) {
      throw new BadRequestException('All questions have been answered');
    }

    const currentTestQuestion = test.testQuestions[session.currentQuestionIndex];
    const question = currentTestQuestion.question;

    // Verify selected option belongs to current question
    const selectedOption = question.options.find(option => option.id === answerDto.selectedOptionId);
    if (!selectedOption) {
      throw new BadRequestException('Selected option does not belong to current question');
    }

    // Calculate points earned
    const pointsEarned = selectedOption.isCorrect ? currentTestQuestion.points : 0;

    // Save answer
    const answer = this.testSessionAnswerRepository.create({
      sessionId: session.id,
      questionId: question.id,
      selectedOptionId: answerDto.selectedOptionId,
      questionOrder: session.currentQuestionIndex + 1,
      isCorrect: selectedOption.isCorrect,
      timeSpentSeconds: answerDto.timeSpentSeconds,
      pointsEarned,
    });

    await this.testSessionAnswerRepository.save(answer);

    // Update session
    session.currentQuestionIndex++;
    if (answerDto.timeSpentSeconds) {
      session.timeSpentSeconds += answerDto.timeSpentSeconds;
    }

    await this.testSessionRepository.save(session);

    const isLastQuestion = session.currentQuestionIndex >= test.testQuestions.length;
    const nextQuestionAvailable = !isLastQuestion;

    // If this was the last question, complete the test
    if (isLastQuestion) {
      await this.completeTest(session.id);
    }

    return {
      isLastQuestion,
      nextQuestionAvailable,
    };
  }

  async completeTest(sessionId: string): Promise<TestResult> {
    const session = await this.testSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['test', 'answers'],
    });

    if (!session) {
      throw new NotFoundException('Test session not found');
    }

    if (session.status !== TestSessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Test session is not in progress');
    }

    const test = session.test;
    const answers = session.answers;

    // Calculate results
    const totalQuestions = test.questionsCount;
    const answeredQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;
    const unansweredQuestions = totalQuestions - answeredQuestions;

    const totalPoints = test.testQuestions.reduce((sum, tq) => sum + tq.points, 0);
    const earnedPoints = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const scorePercentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const isPassed = scorePercentage >= test.passingScorePercentage;

    const completedAt = new Date();

    // Update session
    session.status = TestSessionStatus.COMPLETED;
    session.completedAt = completedAt;
    await this.testSessionRepository.save(session);

    // Create result
    const result = this.testResultRepository.create({
      userId: session.userId,
      testId: session.testId,
      sessionId: session.id,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      totalPoints,
      earnedPoints,
      scorePercentage: Number(scorePercentage.toFixed(2)),
      isPassed,
      timeSpentSeconds: session.timeSpentSeconds,
      completedAt,
    });

    return this.testResultRepository.save(result);
  }

  async getUserResults(userId: string): Promise<TestResult[]> {
    return this.testResultRepository.find({
      where: { userId },
      relations: ['test'],
      order: { completedAt: 'DESC' },
    });
  }

  async getTestResults(testId: string): Promise<TestResult[]> {
    return this.testResultRepository.find({
      where: { testId },
      relations: ['user'],
      order: { completedAt: 'DESC' },
    });
  }

  async getResultById(id: string): Promise<TestResult> {
    const result = await this.testResultRepository.findOne({
      where: { id },
      relations: ['test', 'user', 'session', 'session.answers', 'session.answers.question', 'session.answers.selectedOption'],
    });

    if (!result) {
      throw new NotFoundException('Test result not found');
    }

    return result;
  }
} 