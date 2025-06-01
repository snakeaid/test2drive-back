import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { LecturesService } from './lectures.service';
import { CreateLectureCategoryDto } from './dto/create-lecture-category.dto';
import { UpdateLectureCategoryDto } from './dto/update-lecture-category.dto';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { User } from '../../shared/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { Public } from '../../shared/decorators/public.decorator';

@ApiTags('lectures')
@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  // Category endpoints
  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all lecture categories' })
  @ApiResponse({
    status: 200,
    description: 'List of all lecture categories retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Дорожні знаки' },
          description: { type: 'string', example: 'Вивчення основних дорожніх знаків' },
          sortOrder: { type: 'number', example: 1 },
          lectures: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  })
  findAllCategories() {
    return this.lecturesService.findAllCategories();
  }

  @Public()
  @Get('categories/:id')
  @ApiOperation({ summary: 'Get lecture category by ID' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findCategoryById(@Param('id') id: string) {
    return this.lecturesService.findCategoryById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('categories')
  @ApiOperation({ summary: 'Create a new lecture category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createCategory(@Body() createCategoryDto: CreateLectureCategoryDto) {
    return this.lecturesService.createCategory(createCategoryDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update lecture category' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateLectureCategoryDto) {
    return this.lecturesService.updateCategory(id, updateCategoryDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete lecture category' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeCategory(@Param('id') id: string) {
    return this.lecturesService.removeCategory(id);
  }

  // Lecture endpoints
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published lectures' })
  @ApiResponse({
    status: 200,
    description: 'List of all published lectures retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Попереджувальні знаки' },
          content: { type: 'string' },
          sortOrder: { type: 'number' },
          category: { type: 'object' },
        },
      },
    },
  })
  findAllLectures() {
    return this.lecturesService.findAllLectures();
  }

  @Public()
  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get lectures by category' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Lectures in category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findLecturesByCategory(@Param('categoryId') categoryId: string) {
    return this.lecturesService.findLecturesByCategory(categoryId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get lecture by ID' })
  @ApiParam({ name: 'id', description: 'Lecture UUID' })
  @ApiResponse({ status: 200, description: 'Lecture retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lecture not found' })
  findLectureById(@Param('id') id: string) {
    return this.lecturesService.findLectureById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Create a new lecture' })
  @ApiResponse({ status: 201, description: 'Lecture created successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createLecture(@Body() createLectureDto: CreateLectureDto) {
    return this.lecturesService.createLecture(createLectureDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Update lecture' })
  @ApiParam({ name: 'id', description: 'Lecture UUID' })
  @ApiResponse({ status: 200, description: 'Lecture updated successfully' })
  @ApiResponse({ status: 404, description: 'Lecture not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateLecture(@Param('id') id: string, @Body() updateLectureDto: UpdateLectureDto) {
    return this.lecturesService.updateLecture(id, updateLectureDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete lecture' })
  @ApiParam({ name: 'id', description: 'Lecture UUID' })
  @ApiResponse({ status: 200, description: 'Lecture deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lecture not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeLecture(@Param('id') id: string) {
    return this.lecturesService.removeLecture(id);
  }

  // Progress endpoints
  @ApiBearerAuth('JWT-auth')
  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark lecture as completed' })
  @ApiParam({ name: 'id', description: 'Lecture UUID' })
  @ApiResponse({ status: 201, description: 'Lecture marked as completed' })
  @ApiResponse({ status: 404, description: 'Lecture not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  markLectureAsCompleted(@Param('id') lectureId: string, @User() user: UserEntity) {
    return this.lecturesService.markLectureAsCompleted(user.id, lectureId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('progress/me')
  @ApiOperation({ summary: 'Get current user lecture progress' })
  @ApiResponse({
    status: 200,
    description: 'User progress retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          isCompleted: { type: 'boolean' },
          completedAt: { type: 'string', format: 'date-time', nullable: true },
          lecture: { type: 'object' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserProgress(@User() user: UserEntity) {
    return this.lecturesService.getUserProgress(user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('progress/me/category/:categoryId')
  @ApiOperation({ summary: 'Get current user progress for specific category' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'User progress for category retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserProgressByCategory(@User() user: UserEntity, @Param('categoryId') categoryId: string) {
    return this.lecturesService.getUserProgressByCategory(user.id, categoryId);
  }
} 