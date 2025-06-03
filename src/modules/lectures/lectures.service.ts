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

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(LectureCategory)
    private lectureCategoryRepository: Repository<LectureCategory>,
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
    @InjectRepository(LectureProgress)
    private lectureProgressRepository: Repository<LectureProgress>,
  ) {}

  // Category methods
  async createCategory(createCategoryDto: CreateLectureCategoryDto): Promise<LectureCategory> {
    const existingCategory = await this.lectureCategoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.lectureCategoryRepository.create(createCategoryDto);
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

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateLectureCategoryDto): Promise<LectureCategory> {
    const category = await this.findCategoryById(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.lectureCategoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.lectureCategoryRepository.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.lectureCategoryRepository.remove(category);
  }

  // Lecture methods
  async createLecture(createLectureDto: CreateLectureDto): Promise<Lecture> {
    // Verify category exists
    await this.findCategoryById(createLectureDto.categoryId);

    const lecture = this.lectureRepository.create(createLectureDto);
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
    // Verify category exists
    await this.findCategoryById(categoryId);

    return this.lectureRepository.find({
      where: { categoryId, isPublished: true },
      relations: ['category'],
      order: { sortOrder: 'ASC', title: 'ASC' },
    });
  }

  async findLectureById(id: string): Promise<Lecture> {
    const lecture = await this.lectureRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    return lecture;
  }

  async updateLecture(id: string, updateLectureDto: UpdateLectureDto): Promise<Lecture> {
    const lecture = await this.findLectureById(id);

    if (updateLectureDto.categoryId) {
      // Verify new category exists
      await this.findCategoryById(updateLectureDto.categoryId);
    }

    Object.assign(lecture, updateLectureDto);
    return this.lectureRepository.save(lecture);
  }

  async removeLecture(id: string): Promise<void> {
    const lecture = await this.findLectureById(id);
    await this.lectureRepository.remove(lecture);
  }

  // Progress methods
  async markLectureAsCompleted(userId: string, lectureId: string): Promise<LectureProgress> {
    // Verify lecture exists
    await this.findLectureById(lectureId);

    let progress = await this.lectureProgressRepository.findOne({
      where: { userId, lectureId },
    });

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

    return this.lectureProgressRepository.save(progress);
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
      where: { 
        userId,
        lecture: { categoryId }
      },
      relations: ['lecture', 'lecture.category'],
      order: { createdAt: 'DESC' },
    });
  }
} 