import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LectureCategory } from './entities/lecture-category.entity';
import { Lecture } from './entities/lecture.entity';
import { LectureProgress } from './entities/lecture-progress.entity';
import { CreateLectureCategoryDto } from './dto/create-lecture-category.dto';
import { UpdateLectureCategoryDto } from './dto/update-lecture-category.dto';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(LectureCategory)
    private lectureCategoryRepository: Repository<LectureCategory>,
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
    @InjectRepository(LectureProgress)
    private lectureProgressRepository: Repository<LectureProgress>,
    private readonly cacheService: CacheService,
  ) {}

  async createCategory(createDto: CreateLectureCategoryDto): Promise<LectureCategory> {
    const exists = await this.lectureCategoryRepository.findOne({ where: { name: createDto.name } });
    if (exists) throw new ConflictException('Category already exists');

    const category = this.lectureCategoryRepository.create(createDto);
    return this.lectureCategoryRepository.save(category);
  }

  async findAllCategories(): Promise<LectureCategory[]> {
    return this.lectureCategoryRepository.find({
      relations: ['lectures'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findCategoryById(id: string): Promise<LectureCategory> {
    const category = await this.lectureCategoryRepository.findOne({
      where: { id },
      relations: ['lectures'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(id: string, dto: UpdateLectureCategoryDto): Promise<LectureCategory> {
    const category = await this.findCategoryById(id);
    if (dto.name && dto.name !== category.name) {
      const exists = await this.lectureCategoryRepository.findOne({ where: { name: dto.name } });
      if (exists) throw new ConflictException('Category already exists');
    }
    Object.assign(category, dto);
    return this.lectureCategoryRepository.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.lectureCategoryRepository.remove(category);
  }

  async createLecture(dto: CreateLectureDto): Promise<Lecture> {
    await this.findCategoryById(dto.categoryId);
    const lecture = this.lectureRepository.create(dto);
    return this.lectureRepository.save(lecture);
  }

  async findAllLectures(): Promise<Lecture[]> {
    return this.lectureRepository.find({
      relations: ['category'],
      where: { isPublished: true },
      order: { sortOrder: 'ASC', title: 'ASC' },
    });
  }

  async findLecturesByCategory(categoryId: string): Promise<Lecture[]> {
    await this.findCategoryById(categoryId);
    return this.lectureRepository.find({
      where: { categoryId, isPublished: true },
      relations: ['category'],
      order: { sortOrder: 'ASC', title: 'ASC' },
    });
  }

  async findLectureById(id: string): Promise<Lecture> {
    const lecture = await this.lectureRepository.findOne({ where: { id }, relations: ['category'] });
    if (!lecture) throw new NotFoundException('Lecture not found');
    return lecture;
  }

  async updateLecture(id: string, dto: UpdateLectureDto): Promise<Lecture> {
    const lecture = await this.findLectureById(id);
    if (dto.categoryId) await this.findCategoryById(dto.categoryId);
    Object.assign(lecture, dto);
    return this.lectureRepository.save(lecture);
  }

  async removeLecture(id: string): Promise<void> {
    const lecture = await this.findLectureById(id);
    await this.lectureRepository.remove(lecture);
  }

  async markLectureAsCompleted(userId: string, lectureId: string): Promise<LectureProgress> {
    await this.findLectureById(lectureId);

    let progress = await this.lectureProgressRepository.findOne({ where: { userId, lectureId } });
    if (!progress) {
      progress = this.lectureProgressRepository.create({
        userId,
        lectureId,
        isCompleted: true,
        completedAt: new Date(),
      });
    } else {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }

    const saved = await this.lectureProgressRepository.save(progress);

    // Invalidate cache
    await this.cacheService.del(`stats:summary:${userId}`);
    await this.cacheService.del(`stats:lectures:${userId}`);

    return saved;
  }

  async getUserProgress(userId: string): Promise<LectureProgress[]> {
    return this.lectureProgressRepository.find({
      where: { userId },
      relations: ['lecture', 'lecture.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserProgressByCategory(userId: string, categoryId: string): Promise<LectureProgress[]> {
    return this.lectureProgressRepository.find({
      where: { userId, lecture: { categoryId } },
      relations: ['lecture', 'lecture.category'],
      order: { createdAt: 'DESC' },
    });
  }
}
