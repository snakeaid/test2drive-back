import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AnswerTestQuestionDto } from '../tests/dto/answer-test-question.dto';
import { User } from '../../shared/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { Public } from '../../shared/decorators/public.decorator';

@ApiTags('exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  // Exam CRUD endpoints
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published exams' })
  @ApiQuery({ 
    name: 'includeUnpublished', 
    required: false, 
    type: Boolean, 
    description: 'Include unpublished exams (requires authentication)' 
  })
  @ApiResponse({
    status: 200,
    description: 'List of exams retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Офіційний іспит з правил дорожнього руху' },
          description: { type: 'string' },
          type: { type: 'string', example: 'exam' },
          timeLimitMinutes: { type: 'number', example: 20 },
          passingScorePercentage: { type: 'number', example: 75 },
          questionsCount: { type: 'number', example: 20 },
          allowRetries: { type: 'boolean', example: false },
          showResultsImmediately: { type: 'boolean', example: false },
          category: { type: 'object', nullable: true },
        },
      },
    },
  })
  findAllExams(@Query('includeUnpublished') includeUnpublished?: boolean) {
    return this.examsService.findAllExams(includeUnpublished);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Exam retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string', example: 'exam' },
        timeLimitMinutes: { type: 'number' },
        passingScorePercentage: { type: 'number' },
        questionsCount: { type: 'number' },
        allowRetries: { type: 'boolean' },
        testQuestions: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              questionOrder: { type: 'number' },
              points: { type: 'number' },
              question: { type: 'object' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  @ApiResponse({ status: 400, description: 'Test is not an exam' })
  findExamById(@Param('id') id: string) {
    return this.examsService.findExamById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Create a new exam' })
  @ApiResponse({ status: 201, description: 'Exam created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid questions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createExam(@Body() createExamDto: CreateExamDto) {
    return this.examsService.createExam(createExamDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Update exam' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  @ApiResponse({ status: 200, description: 'Exam updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or test is not an exam' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateExam(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.updateExam(id, updateExamDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete exam' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  @ApiResponse({ status: 200, description: 'Exam deleted successfully' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  @ApiResponse({ status: 400, description: 'Test is not an exam' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeExam(@Param('id') id: string) {
    return this.examsService.removeExam(id);
  }

  // Exam session endpoints
  @ApiBearerAuth('JWT-auth')
  @Post(':id/start')
  @ApiOperation({ summary: 'Start an exam session' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  @ApiResponse({ 
    status: 201, 
    description: 'Exam session started successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        status: { type: 'string', example: 'in_progress' },
        startedAt: { type: 'string', format: 'date-time' },
        expiresAt: { type: 'string', format: 'date-time' },
        currentQuestionIndex: { type: 'number', example: 0 },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Active session already exists' })
  @ApiResponse({ status: 403, description: 'Exam not published, already completed, or retries not allowed' })
  @ApiResponse({ status: 400, description: 'Exam must have time limit or test is not an exam' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  startExam(@Param('id') examId: string, @User() user: UserEntity) {
    return this.examsService.startExam(user.id, examId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id/session')
  @ApiOperation({ summary: 'Get active exam session' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  @ApiResponse({ status: 200, description: 'Active exam session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No active session found' })
  @ApiResponse({ status: 403, description: 'Session has expired' })
  @ApiResponse({ status: 400, description: 'Test is not an exam' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getActiveExamSession(@Param('id') examId: string, @User() user: UserEntity) {
    return this.examsService.getActiveExamSession(user.id, examId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id/current-question')
  @ApiOperation({ summary: 'Get current question in active exam session' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Current exam question retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        question: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            questionText: { type: 'string' },
            questionImageUrl: { type: 'string', nullable: true },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
            options: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  optionLetter: { type: 'string' },
                  optionText: { type: 'string' },
                },
              },
            },
          },
        },
        questionNumber: { type: 'number', example: 1 },
        totalQuestions: { type: 'number', example: 20 },
        timeRemaining: { type: 'number', example: 1200 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'All questions answered or test is not an exam' })
  @ApiResponse({ status: 404, description: 'No active session found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCurrentExamQuestion(@Param('id') examId: string, @User() user: UserEntity) {
    return this.examsService.getCurrentExamQuestion(user.id, examId);
  }

  @ApiBearerAuth('JWT-auth')
  @Post(':id/answer')
  @ApiOperation({ summary: 'Submit answer for current exam question' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  @ApiResponse({ 
    status: 201, 
    description: 'Exam answer submitted successfully',
    schema: {
      type: 'object',
      properties: {
        isLastQuestion: { type: 'boolean' },
        nextQuestionAvailable: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid option, all questions answered, or test is not an exam' })
  @ApiResponse({ status: 404, description: 'No active session found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  answerExamQuestion(
    @Param('id') examId: string,
    @Body() answerDto: AnswerTestQuestionDto,
    @User() user: UserEntity,
  ) {
    return this.examsService.answerExamQuestion(user.id, examId, answerDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('sessions/:sessionId/complete')
  @ApiOperation({ summary: 'Complete exam session manually' })
  @ApiParam({ name: 'sessionId', description: 'Exam session UUID' })
  @ApiResponse({ 
    status: 201, 
    description: 'Exam completed successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        totalQuestions: { type: 'number' },
        correctAnswers: { type: 'number' },
        incorrectAnswers: { type: 'number' },
        unansweredQuestions: { type: 'number' },
        scorePercentage: { type: 'number' },
        isPassed: { type: 'boolean' },
        timeSpentSeconds: { type: 'number' },
        completedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Session not in progress' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  completeExam(@Param('sessionId') sessionId: string) {
    return this.examsService.completeExam(sessionId);
  }

  // Exam results endpoints
  @ApiBearerAuth('JWT-auth')
  @Get('results/me')
  @ApiOperation({ summary: 'Get current user exam results' })
  @ApiResponse({
    status: 200,
    description: 'User exam results retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          totalQuestions: { type: 'number' },
          correctAnswers: { type: 'number' },
          scorePercentage: { type: 'number' },
          isPassed: { type: 'boolean' },
          completedAt: { type: 'string', format: 'date-time' },
          test: { 
            type: 'object',
            properties: {
              title: { type: 'string' },
              type: { type: 'string', example: 'exam' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserExamResults(@User() user: UserEntity) {
    return this.examsService.getUserExamResults(user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id/results')
  @ApiOperation({ summary: 'Get results for specific exam' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  @ApiResponse({ status: 200, description: 'Exam results retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Test is not an exam' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getExamResults(@Param('id') examId: string) {
    return this.examsService.getExamResults(examId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('results/:id')
  @ApiOperation({ summary: 'Get detailed exam result by ID' })
  @ApiParam({ name: 'id', description: 'Result UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detailed exam result retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        totalQuestions: { type: 'number' },
        correctAnswers: { type: 'number' },
        incorrectAnswers: { type: 'number' },
        scorePercentage: { type: 'number' },
        isPassed: { type: 'boolean' },
        test: { 
          type: 'object',
          properties: {
            title: { type: 'string' },
            type: { type: 'string', example: 'exam' },
          },
        },
        session: {
          type: 'object',
          properties: {
            answers: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  questionOrder: { type: 'number' },
                  isCorrect: { type: 'boolean' },
                  question: { type: 'object' },
                  selectedOption: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Result not found' })
  @ApiResponse({ status: 400, description: 'Result is not for an exam' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getExamResultById(@Param('id') id: string) {
    return this.examsService.getExamResultById(id);
  }

  // Exam statistics endpoint
  @ApiBearerAuth('JWT-auth')
  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get exam statistics' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Exam statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        examId: { type: 'string', format: 'uuid' },
        examTitle: { type: 'string' },
        totalAttempts: { type: 'number' },
        passedAttempts: { type: 'number' },
        passRate: { type: 'number', example: 85.5 },
        averageScore: { type: 'number', example: 78.2 },
        averageTimeMinutes: { type: 'number', example: 18.5 },
        passingScorePercentage: { type: 'number' },
        timeLimitMinutes: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Test is not an exam' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getExamStatistics(@Param('id') examId: string) {
    return this.examsService.getExamStatistics(examId);
  }
} 