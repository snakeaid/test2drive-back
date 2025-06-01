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
import { QuestionCategory } from '../../questions/entities/question-category.entity';
import { TestQuestion } from './test-question.entity';
import { TestSession } from './test-session.entity';
import { TestResult } from './test-result.entity';

export enum TestType {
  PRACTICE = 'practice',
  THEMATIC = 'thematic',
  EXAM = 'exam',
}

@Entity('tests')
export class Test {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TestType,
    default: TestType.PRACTICE,
  })
  type: TestType;

  @Column({ name: 'time_limit_minutes', nullable: true })
  timeLimitMinutes?: number; // null = no time limit

  @Column({ name: 'passing_score_percentage', default: 70 })
  passingScorePercentage: number;

  @Column({ name: 'questions_count' })
  questionsCount: number;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @Column({ name: 'allow_retries', default: true })
  allowRetries: boolean;

  @Column({ name: 'show_results_immediately', default: true })
  showResultsImmediately: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => QuestionCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: QuestionCategory;

  @Column({ name: 'category_id', nullable: true })
  categoryId?: string;

  @OneToMany(() => TestQuestion, (testQuestion) => testQuestion.test, { cascade: true })
  testQuestions: TestQuestion[];

  @OneToMany(() => TestSession, (session) => session.test)
  sessions: TestSession[];

  @OneToMany(() => TestResult, (result) => result.test)
  results: TestResult[];
} 