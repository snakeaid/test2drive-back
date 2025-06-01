import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Test } from './test.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('test_questions')
@Unique(['testId', 'questionId'])
export class TestQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_order' })
  questionOrder: number; // Order of question in the test

  @Column({ name: 'points', default: 1 })
  points: number; // Points for this question in the test

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Test, (test) => test.testQuestions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @Column({ name: 'test_id' })
  testId: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ name: 'question_id' })
  questionId: string;
} 