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
import { TestSession } from './test-session.entity';
import { Question } from '../../questions/entities/question.entity';
import { QuestionOption } from '../../questions/entities/question-option.entity';

@Entity('test_session_answers')
@Unique(['sessionId', 'questionId'])
export class TestSessionAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_order' })
  questionOrder: number;

  @Column({ name: 'is_correct', default: false })
  isCorrect: boolean;

  @Column({ name: 'time_spent_seconds', nullable: true })
  timeSpentSeconds?: number;

  @Column({ name: 'points_earned', default: 0 })
  pointsEarned: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => TestSession, (session) => session.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: TestSession;

  @Column({ name: 'session_id' })
  sessionId: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ name: 'question_id' })
  questionId: string;

  @ManyToOne(() => QuestionOption, { nullable: true })
  @JoinColumn({ name: 'selected_option_id' })
  selectedOption?: QuestionOption;

  @Column({ name: 'selected_option_id', nullable: true })
  selectedOptionId?: string;
} 