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
import { QuestionsService } from './questions.service';
import { CreateQuestionCategoryDto } from './dto/create-question-category.dto';
import { UpdateQuestionCategoryDto } from './dto/update-question-category.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { User } from '../../shared/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { Public } from '../../shared/decorators/public.decorator';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // Category endpoints
  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all question categories' })
  @ApiResponse({
    status: 200,
    description: 'List of all question categories retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Дорожні знаки - питання' },
          description: { type: 'string', example: 'Питання про дорожні знаки' },
          sortOrder: { type: 'number', example: 1 },
          lectureCategory: { type: 'object', nullable: true },
          questions: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  })
  findAllCategories() {
    return this.questionsService.findAllCategories();
  }

  @Public()
  @Get('categories/:id')
  @ApiOperation({ summary: 'Get question category by ID' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findCategoryById(@Param('id') id: string) {
    return this.questionsService.findCategoryById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('categories')
  @ApiOperation({ summary: 'Create a new question category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createCategory(@Body() createCategoryDto: CreateQuestionCategoryDto) {
    return this.questionsService.createCategory(createCategoryDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update question category' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateQuestionCategoryDto) {
    return this.questionsService.updateCategory(id, updateCategoryDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete question category' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeCategory(@Param('id') id: string) {
    return this.questionsService.removeCategory(id);
  }

  // Question endpoints
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published questions' })
  @ApiQuery({ 
    name: 'includeUnpublished', 
    required: false, 
    type: Boolean, 
    description: 'Include unpublished questions (requires authentication)' 
  })
  @ApiResponse({
    status: 200,
    description: 'List of questions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          questionText: { type: 'string', example: 'Що означає цей дорожній знак?' },
          questionImageUrl: { type: 'string', nullable: true },
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
          explanation: { type: 'string', nullable: true },
          category: { type: 'object' },
          options: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  })
  findAllQuestions(@Query('includeUnpublished') includeUnpublished?: boolean) {
    return this.questionsService.findAllQuestions(includeUnpublished);
  }

  @Public()
  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get questions by category' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiQuery({ 
    name: 'includeUnpublished', 
    required: false, 
    type: Boolean, 
    description: 'Include unpublished questions' 
  })
  @ApiResponse({ status: 200, description: 'Questions in category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findQuestionsByCategory(
    @Param('categoryId') categoryId: string,
    @Query('includeUnpublished') includeUnpublished?: boolean,
  ) {
    return this.questionsService.findQuestionsByCategory(categoryId, includeUnpublished);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get question by ID' })
  @ApiParam({ name: 'id', description: 'Question UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Question retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        questionText: { type: 'string' },
        questionImageUrl: { type: 'string', nullable: true },
        difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
        explanation: { type: 'string', nullable: true },
        category: { type: 'object' },
        options: { 
          type: 'array', 
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              optionLetter: { type: 'string', example: 'A' },
              optionText: { type: 'string' },
              isCorrect: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Question not found' })
  findQuestionById(@Param('id') id: string) {
    return this.questionsService.findQuestionById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Create a new question' })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid options' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Update question' })
  @ApiParam({ name: 'id', description: 'Question UUID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid options' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateQuestion(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.updateQuestion(id, updateQuestionDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete question' })
  @ApiParam({ name: 'id', description: 'Question UUID' })
  @ApiResponse({ status: 200, description: 'Question deleted successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeQuestion(@Param('id') id: string) {
    return this.questionsService.removeQuestion(id);
  }

  // Answer endpoints
  @ApiBearerAuth('JWT-auth')
  @Post(':id/answer')
  @ApiOperation({ summary: 'Submit answer to a question' })
  @ApiParam({ name: 'id', description: 'Question UUID' })
  @ApiResponse({ 
    status: 201, 
    description: 'Answer submitted successfully',
    schema: {
      type: 'object',
      properties: {
        isCorrect: { type: 'boolean', example: true },
        correctOption: { 
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            optionLetter: { type: 'string', example: 'A' },
            optionText: { type: 'string' },
          },
        },
        explanation: { type: 'string', nullable: true },
        attempt: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid option or validation error' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  answerQuestion(
    @Param('id') questionId: string,
    @Body() answerDto: AnswerQuestionDto,
    @User() user: UserEntity,
  ) {
    return this.questionsService.answerQuestion(user.id, questionId, answerDto);
  }

  // User attempts endpoints
  @ApiBearerAuth('JWT-auth')
  @Get('attempts/me')
  @ApiOperation({ summary: 'Get current user question attempts' })
  @ApiResponse({
    status: 200,
    description: 'User attempts retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          attemptNumber: { type: 'number' },
          isCorrect: { type: 'boolean' },
          timeSpentSeconds: { type: 'number', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          question: { type: 'object' },
          selectedOption: { type: 'object' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserAttempts(@User() user: UserEntity) {
    return this.questionsService.getUserAttempts(user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('attempts/me/category/:categoryId')
  @ApiOperation({ summary: 'Get current user attempts for specific category' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'User attempts for category retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserAttemptsByCategory(@User() user: UserEntity, @Param('categoryId') categoryId: string) {
    return this.questionsService.getUserAttemptsByCategory(user.id, categoryId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('attempts/me/question/:questionId')
  @ApiOperation({ summary: 'Get current user attempts for specific question' })
  @ApiParam({ name: 'questionId', description: 'Question UUID' })
  @ApiResponse({ status: 200, description: 'User attempts for question retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserAttemptsByQuestion(@User() user: UserEntity, @Param('questionId') questionId: string) {
    return this.questionsService.getUserAttemptsByQuestion(user.id, questionId);
  }
} 