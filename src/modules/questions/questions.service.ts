import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
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
import { CacheService } from '../cache/cache.service';

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
    private readonly cacheService: CacheService,
  ) {}

  async createCategory(dto: CreateQuestionCategoryDto): Promise<QuestionCategory> {
    const exists = await this.questionCategoryRepository.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Category already exists');
    const category = this.questionCategoryRepository.create(dto);
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
    if (!category) throw new NotFoundException('Question category not found');
    return category;
  }

  async updateCategory(id: string, dto: UpdateQuestionCategoryDto): Promise<QuestionCategory> {
    const category = await this.findCategoryById(id);
    if (dto.name && dto.name !== category.name) {
      const exists = await this.questionCategoryRepository.findOne({ where: { name: dto.name } });
      if (exists) throw new ConflictException('Category already exists');
    }
    Object.assign(category, dto);
    return this.questionCategoryRepository.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.questionCategoryRepository.remove(category);
  }

  async createQuestion(dto: CreateQuestionDto): Promise<Question> {
    await this.findCategoryById(dto.categoryId);

    const correctOptions = dto.options.filter((opt) => opt.isCorrect);
    if (correctOptions.length !== 1)
      throw new BadRequestException('Exactly one option must be correct');

    const optionLetters = dto.options.map((opt) => opt.optionLetter.toUpperCase());
    const uniqueLetters = new Set(optionLetters);
    if (optionLetters.length !== uniqueLetters.size)
      throw new BadRequestException('Option letters must be unique');

    const question = this.questionRepository.create({
      ...dto,
      options: dto.options.map((opt) => ({
        ...opt,
        optionLetter: opt.optionLetter.toUpperCase(),
      })),
    });

    return this.questionRepository.save(question);
  }

  async findAllQuestions(includeUnpublished = false): Promise<Question[]> {
    const where = includeUnpublished ? {} : { isPublished: true };
    return this.questionRepository.find({
      where,
      relations: ['category', 'options'],
      order: { sortOrder: 'ASC', questionText: 'ASC' },
    });
  }

  async findQuestionsByCategory(categoryId: string, includeUnpublished = false): Promise<Question[]> {
    await this.findCategoryById(categoryId);
    const where = includeUnpublished ? { categoryId } : { categoryId, isPublished: true };
    return this.questionRepository.find({
      where,
      relations: ['category', 'options'],
      order: { sortOrder: 'ASC', questionText: 'ASC' },
    });
  }

  async findQuestionById(id: string, includeOptions = true): Promise<Question> {
    const relations = ['category'];
    if (includeOptions) relations.push('options');

    const question = await this.questionRepository.findOne({
      where: { id },
      relations,
      order: { options: { sortOrder: 'ASC' } },
    });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async updateQuestion(id: string, dto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findQuestionById(id);

    if (dto.categoryId) await this.findCategoryById(dto.categoryId);

    if (dto.options) {
      const correctOptions = dto.options.filter((o) => o.isCorrect);
      if (correctOptions.length !== 1)
        throw new BadRequestException('Exactly one option must be correct');

      await this.questionOptionRepository.delete({ questionId: id });
    }

    Object.assign(question, dto);

    if (dto.options) {
      question.options = dto.options.map((opt) => ({
        ...opt,
        optionLetter: opt.optionLetter.toUpperCase(),
        questionId: id,
      })) as any;
    }

    return this.questionRepository.save(question);
  }

  async removeQuestion(id: string): Promise<void> {
    const question = await this.findQuestionById(id);
    await this.questionRepository.remove(question);
  }

  async answerQuestion(userId: string, questionId: string, dto: AnswerQuestionDto) {
    const question = await this.findQuestionById(questionId);
    const selected = await this.questionOptionRepository.findOne({
      where: { id: dto.selectedOptionId, questionId },
    });
    if (!selected)
      throw new BadRequestException('Selected option does not belong to this question');

    const correctOption = question.options.find((o) => o.isCorrect);
    if (!correctOption)
      throw new BadRequestException('Question has no correct option');

    const last = await this.questionAttemptRepository.findOne({
      where: { userId, questionId },
      order: { attemptNumber: 'DESC' },
    });

    const attempt = this.questionAttemptRepository.create({
      userId,
      questionId,
      selectedOptionId: dto.selectedOptionId,
      isCorrect: selected.isCorrect,
      timeSpentSeconds: dto.timeSpentSeconds,
      attemptNumber: last ? last.attemptNumber + 1 : 1,
    });

    const savedAttempt = await this.questionAttemptRepository.save(attempt);

    // invalidate cache
    await this.cacheService.del(`stats:summary:${userId}`);
    await this.cacheService.del(`stats:tests:${userId}`);

    return {
      isCorrect: selected.isCorrect,
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
      where: { userId, question: { categoryId } },
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
