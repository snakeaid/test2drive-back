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
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { AnswerTestQuestionDto } from './dto/answer-test-question.dto';
import { TestType } from './entities/test.entity';
import { User } from '../../shared/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { Public } from '../../shared/decorators/public.decorator';

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  // Test CRUD endpoints
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published tests' })
  @ApiQuery({ 
    name: 'includeUnpublished', 
    required: false, 
    type: Boolean, 
    description: 'Include unpublished tests (requires authentication)' 
  })
  @ApiResponse({
    status: 200,
    description: 'List of tests retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Тест з дорожніх знаків' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['practice', 'thematic', 'exam'] },
          timeLimitMinutes: { type: 'number', nullable: true },
          passingScorePercentage: { type: 'number' },
          questionsCount: { type: 'number' },
          allowRetries: { type: 'boolean' },
          category: { type: 'object', nullable: true },
        },
      },
    },
  })
  findAllTests(@Query('includeUnpublished') includeUnpublished?: boolean) {
    return this.testsService.findAllTests(includeUnpublished);
  }

  @Public()
  @Get('type/:type')
  @ApiOperation({ summary: 'Get tests by type' })
  @ApiParam({ name: 'type', enum: TestType, description: 'Test type' })
  @ApiQuery({ 
    name: 'includeUnpublished', 
    required: false, 
    type: Boolean, 
    description: 'Include unpublished tests' 
  })
  @ApiResponse({ status: 200, description: 'Tests by type retrieved successfully' })
  findTestsByType(
    @Param('type') type: TestType,
    @Query('includeUnpublished') includeUnpublished?: boolean,
  ) {
    return this.testsService.findTestsByType(type, includeUnpublished);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get test by ID' })
  @ApiParam({ name: 'id', description: 'Test UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Test retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string', enum: ['practice', 'thematic', 'exam'] },
        timeLimitMinutes: { type: 'number', nullable: true },
        passingScorePercentage: { type: 'number' },
        questionsCount: { type: 'number' },
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
  @ApiResponse({ status: 404, description: 'Test not found' })
  findTestById(@Param('id') id: string) {
    return this.testsService.findTestById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Create a new test' })
  @ApiResponse({ status: 201, description: 'Test created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid questions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createTest(@Body() createTestDto: CreateTestDto) {
    return this.testsService.createTest(createTestDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Update test' })
  @ApiParam({ name: 'id', description: 'Test UUID' })
  @ApiResponse({ status: 200, description: 'Test updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid questions' })
  @ApiResponse({ status: 404, description: 'Test not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateTest(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.updateTest(id, updateTestDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete test' })
  @ApiParam({ name: 'id', description: 'Test UUID' })
  @ApiResponse({ status: 200, description: 'Test deleted successfully' })
  @ApiResponse({ status: 404, description: 'Test not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeTest(@Param('id') id: string) {
    return this.testsService.removeTest(id);
  }

  // Test session endpoints
  @ApiBearerAuth('JWT-auth')
  @Post(':id/start')
  @ApiOperation({ summary: 'Start a test session' })
  @ApiParam({ name: 'id', description: 'Test UUID' })
  @ApiResponse({ 
    status: 201, 
    description: 'Test session started successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        status: { type: 'string', example: 'in_progress' },
        startedAt: { type: 'string', format: 'date-time' },
        expiresAt: { type: 'string', format: 'date-time', nullable: true },
        currentQuestionIndex: { type: 'number', example: 0 },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Active session already exists' })
  @ApiResponse({ status: 403, description: 'Test not published or retries not allowed' })
  @ApiResponse({ status: 404, description: 'Test not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  startTest(@Param('id') testId: string, @User() user: UserEntity) {
    return this.testsService.startTest(user.id, testId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id/session')
  @ApiOperation({ summary: 'Get active test session' })
  @ApiParam({ name: 'id', description: 'Test UUID' })
  @ApiResponse({ status: 200, description: 'Active session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No active session found' })
  @ApiResponse({ status: 403, description: 'Session has expired' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getActiveSession(@Param('id') testId: string, @User() user: UserEntity) {
    return this.testsService.getActiveSession(user.id, testId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id/current-question')
  @ApiOperation({ summary: 'Get current question in active test session' })
  @ApiParam({ name: 'id', description: 'Test UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Current question retrieved successfully',
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
        timeRemaining: { type: 'number', example: 1200, nullable: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'All questions have been answered' })
  @ApiResponse({ status: 404, description: 'No active session found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCurrentQuestion(@Param('id') testId: string, @User() user: UserEntity) {
    return this.testsService.getCurrentQuestion(user.id, testId);
  }

  @ApiBearerAuth('JWT-auth')
  @Post(':id/answer')
  @ApiOperation({ summary: 'Submit answer for current question' })
  @ApiParam({ name: 'id', description: 'Test UUID' })
  @ApiResponse({ 
    status: 201, 
    description: 'Answer submitted successfully',
    schema: {
      type: 'object',
      properties: {
        isLastQuestion: { type: 'boolean' },
        nextQuestionAvailable: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid option or all questions answered' })
  @ApiResponse({ status: 404, description: 'No active session found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  answerQuestion(
    @Param('id') testId: string,
    @Body() answerDto: AnswerTestQuestionDto,
    @User() user: UserEntity,
  ) {
    return this.testsService.answerQuestion(user.id, testId, answerDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('sessions/:sessionId/complete')
  @ApiOperation({ summary: 'Complete test session manually' })
  @ApiParam({ name: 'sessionId', description: 'Test session UUID' })
  @ApiResponse({ 
    status: 201, 
    description: 'Test completed successfully',
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
  completeTest(@Param('sessionId') sessionId: string) {
    return this.testsService.completeTest(sessionId);
  }

  // Results endpoints
  @ApiBearerAuth('JWT-auth')
  @Get('results/me')
  @ApiOperation({ summary: 'Get current user test results' })
  @ApiResponse({
    status: 200,
    description: 'User test results retrieved successfully',
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
          test: { type: 'object' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserResults(@User() user: UserEntity) {
    return this.testsService.getUserResults(user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id/results')
  @ApiOperation({ summary: 'Get results for specific test' })
  @ApiParam({ name: 'id', description: 'Test UUID' })
  @ApiResponse({ status: 200, description: 'Test results retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getTestResults(@Param('id') testId: string) {
    return this.testsService.getTestResults(testId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('results/:id')
  @ApiOperation({ summary: 'Get detailed test result by ID' })
  @ApiParam({ name: 'id', description: 'Result UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detailed test result retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        totalQuestions: { type: 'number' },
        correctAnswers: { type: 'number' },
        incorrectAnswers: { type: 'number' },
        scorePercentage: { type: 'number' },
        isPassed: { type: 'boolean' },
        test: { type: 'object' },
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getResultById(@Param('id') id: string) {
    return this.testsService.getResultById(id);
  }
} 