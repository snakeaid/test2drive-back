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
import { User } from '../../users/entities/user.entity';
import { Test } from './test.entity';
import { TestSessionAnswer } from './test-session-answer.entity';

export enum TestSessionStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  ABANDONED = 'abandoned',
}

@Entity('test_sessions')
export class TestSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TestSessionStatus,
    default: TestSessionStatus.IN_PROGRESS,
  })
  status: TestSessionStatus;

  @Column({ name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'completed_at', nullable: true })
  completedAt?: Date;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt?: Date;

  @Column({ name: 'current_question_index', default: 0 })
  currentQuestionIndex: number;

  @Column({ name: 'time_spent_seconds', default: 0 })
  timeSpentSeconds: number;

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

  @ManyToOne(() => Test, (test) => test.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @Column({ name: 'test_id' })
  testId: string;

  @OneToMany(() => TestSessionAnswer, (answer) => answer.session, { cascade: true })
  answers: TestSessionAnswer[];
} 