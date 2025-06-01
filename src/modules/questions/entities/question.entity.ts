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
import { QuestionCategory } from './question-category.entity';
import { QuestionOption } from './question-option.entity';
import { QuestionAttempt } from './question-attempt.entity';

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  questionText: string;

  @Column({ name: 'question_image_url', nullable: true })
  questionImageUrl?: string;

  @Column({
    type: 'enum',
    enum: QuestionDifficulty,
    default: QuestionDifficulty.MEDIUM,
  })
  difficulty: QuestionDifficulty;

  @Column({ type: 'text', nullable: true })
  explanation?: string;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => QuestionCategory, (category) => category.questions)
  @JoinColumn({ name: 'category_id' })
  category: QuestionCategory;

  @Column({ name: 'category_id' })
  categoryId: string;

  @OneToMany(() => QuestionOption, (option) => option.question, { cascade: true })
  options: QuestionOption[];

  @OneToMany(() => QuestionAttempt, (attempt) => attempt.question)
  attempts: QuestionAttempt[];
} 