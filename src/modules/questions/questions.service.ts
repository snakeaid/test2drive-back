import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionCategory } from './entities/question-category.entity';
import { Question } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
import { QuestionAttempt } from './entities/question-attempt.entity';
import { CreateQuestionCategoryDto } from './dto/create-question-category.dto';
import { UpdateQuestionCategoryDto } from './dto/update-question-category.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionCategory)
    private questionCategoryRepository: Repository<QuestionCategory>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private questionOptionRepository: Repository<QuestionOption>,
    @InjectRepository(QuestionAttempt)
    private questionAttemptRepository: Repository<QuestionAttempt>,
  ) {}

  // Category methods
  async createCategory(createCategoryDto: CreateQuestionCategoryDto): Promise<QuestionCategory> {
    const existingCategory = await this.questionCategoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.questionCategoryRepository.create(createCategoryDto);
    return this.questionCategoryRepository.save(category);
  }

  async findAllCategories(): Promise<QuestionCategory[]> {
    return this.questionCategoryRepository.find({
      relations: ['lectureCategory', 'questions'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findCategoryById(id: string): Promise<QuestionCategory> {
    const category = await this.questionCategoryRepository.findOne({
      where: { id },
      relations: ['lectureCategory', 'questions'],
    });

    if (!category) {
      throw new NotFoundException('Question category not found');
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateQuestionCategoryDto): Promise<QuestionCategory> {
    const category = await this.findCategoryById(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.questionCategoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.questionCategoryRepository.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.questionCategoryRepository.remove(category);
  }

  // Question methods
  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
    // Verify category exists
    await this.findCategoryById(createQuestionDto.categoryId);

    // Validate options
    const correctOptions = createQuestionDto.options.filter(option => option.isCorrect);
    if (correctOptions.length !== 1) {
      throw new BadRequestException('Question must have exactly one correct option');
    }

    // Validate option letters are unique
    const optionLetters = createQuestionDto.options.map(option => option.optionLetter.toUpperCase());
    const uniqueLetters = new Set(optionLetters);
    if (optionLetters.length !== uniqueLetters.size) {
      throw new BadRequestException('Option letters must be unique');
    }

    const question = this.questionRepository.create({
      ...createQuestionDto,
      options: createQuestionDto.options.map(option => ({
        ...option,
        optionLetter: option.optionLetter.toUpperCase(),
      })),
    });

    return this.questionRepository.save(question);
  }

  async findAllQuestions(includeUnpublished = false): Promise<Question[]> {
    const whereCondition = includeUnpublished ? {} : { isPublished: true };
    
    return this.questionRepository.find({
      where: whereCondition,
      relations: ['category', 'options'],
      order: { sortOrder: 'ASC', questionText: 'ASC' },
    });
  }

  async findQuestionsByCategory(categoryId: string, includeUnpublished = false): Promise<Question[]> {
    // Verify category exists
    await this.findCategoryById(categoryId);

    const whereCondition = includeUnpublished 
      ? { categoryId } 
      : { categoryId, isPublished: true };

    return this.questionRepository.find({
      where: whereCondition,
      relations: ['category', 'options'],
      order: { sortOrder: 'ASC', questionText: 'ASC' },
    });
  }

  async findQuestionById(id: string, includeOptions = true): Promise<Question> {
    const relations = ['category'];
    if (includeOptions) {
      relations.push('options');
    }

    const question = await this.questionRepository.findOne({
      where: { id },
      relations,
      order: { options: { sortOrder: 'ASC' } },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async updateQuestion(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findQuestionById(id);

    if (updateQuestionDto.categoryId) {
      // Verify new category exists
      await this.findCategoryById(updateQuestionDto.categoryId);
    }

    if (updateQuestionDto.options) {
      // Validate options if provided
      const correctOptions = updateQuestionDto.options.filter(option => option.isCorrect);
      if (correctOptions.length !== 1) {
        throw new BadRequestException('Question must have exactly one correct option');
      }

      // Remove existing options
      await this.questionOptionRepository.delete({ questionId: id });
    }

    Object.assign(question, updateQuestionDto);
    
    if (updateQuestionDto.options) {
      question.options = updateQuestionDto.options.map(option => ({
        ...option,
        optionLetter: option.optionLetter.toUpperCase(),
        questionId: id,
      })) as any;
    }

    return this.questionRepository.save(question);
  }

  async removeQuestion(id: string): Promise<void> {
    const question = await this.findQuestionById(id);
    await this.questionRepository.remove(question);
  }

  // Answer methods
  async answerQuestion(userId: string, questionId: string, answerDto: AnswerQuestionDto): Promise<{
    isCorrect: boolean;
    correctOption: QuestionOption;
    explanation?: string;
    attempt: QuestionAttempt;
  }> {
    // Verify question exists
    const question = await this.findQuestionById(questionId);

    // Verify selected option belongs to this question
    const selectedOption = await this.questionOptionRepository.findOne({
      where: { id: answerDto.selectedOptionId, questionId },
    });

    if (!selectedOption) {
      throw new BadRequestException('Selected option does not belong to this question');
    }

    // Find correct option
    const correctOption = question.options.find(option => option.isCorrect);
    if (!correctOption) {
      throw new BadRequestException('Question has no correct option');
    }

    // Get next attempt number
    const lastAttempt = await this.questionAttemptRepository.findOne({
      where: { userId, questionId },
      order: { attemptNumber: 'DESC' },
    });

    const attemptNumber = lastAttempt ? lastAttempt.attemptNumber + 1 : 1;

    // Create attempt record
    const attempt = this.questionAttemptRepository.create({
      userId,
      questionId,
      selectedOptionId: answerDto.selectedOptionId,
      isCorrect: selectedOption.isCorrect,
      timeSpentSeconds: answerDto.timeSpentSeconds,
      attemptNumber,
    });

    const savedAttempt = await this.questionAttemptRepository.save(attempt);

    return {
      isCorrect: selectedOption.isCorrect,
      correctOption,
      explanation: question.explanation,
      attempt: savedAttempt,
    };
  }

  async getUserAttempts(userId: string): Promise<QuestionAttempt[]> {
    return this.questionAttemptRepository.find({
      where: { userId },
      relations: ['question', 'question.category', 'selectedOption'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserAttemptsByCategory(userId: string, categoryId: string): Promise<QuestionAttempt[]> {
    return this.questionAttemptRepository.find({
      where: { 
        userId,
        question: { categoryId }
      },
      relations: ['question', 'question.category', 'selectedOption'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserAttemptsByQuestion(userId: string, questionId: string): Promise<QuestionAttempt[]> {
    return this.questionAttemptRepository.find({
      where: { userId, questionId },
      relations: ['selectedOption'],
      order: { attemptNumber: 'ASC' },
    });
  }
} 