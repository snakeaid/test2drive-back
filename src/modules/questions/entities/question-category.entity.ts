import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { LectureCategory } from '../../lectures/entities/lecture-category.entity';
import { Question } from './question.entity';

@Entity('question_categories')
export class QuestionCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => LectureCategory, { nullable: true })
  @JoinColumn({ name: 'lecture_category_id' })
  lectureCategory?: LectureCategory;

  @Column({ name: 'lecture_category_id', nullable: true })
  lectureCategoryId?: string;

  @OneToMany(() => Question, (question) => question.category)
  questions: Question[];
} 