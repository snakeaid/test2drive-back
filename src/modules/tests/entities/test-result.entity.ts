import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Test } from './test.entity';
import { TestSession } from './test-session.entity';

@Entity('test_results')
export class TestResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'total_questions' })
  totalQuestions: number;

  @Column({ name: 'correct_answers' })
  correctAnswers: number;

  @Column({ name: 'incorrect_answers' })
  incorrectAnswers: number;

  @Column({ name: 'unanswered_questions', default: 0 })
  unansweredQuestions: number;

  @Column({ name: 'total_points' })
  totalPoints: number;

  @Column({ name: 'earned_points' })
  earnedPoints: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'score_percentage' })
  scorePercentage: number;

  @Column({ name: 'is_passed' })
  isPassed: boolean;

  @Column({ name: 'time_spent_seconds' })
  timeSpentSeconds: number;

  @Column({ name: 'completed_at' })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Test, (test) => test.results, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @Column({ name: 'test_id' })
  testId: string;

  @OneToOne(() => TestSession)
  @JoinColumn({ name: 'session_id' })
  session: TestSession;

  @Column({ name: 'session_id' })
  sessionId: string;
} 