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
import { User } from '../../users/entities/user.entity';
import { Question } from './question.entity';
import { QuestionOption } from './question-option.entity';

@Entity('question_attempts')
@Unique(['userId', 'questionId', 'attemptNumber'])
export class QuestionAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'attempt_number', default: 1 })
  attemptNumber: number;

  @Column({ name: 'is_correct', default: false })
  isCorrect: boolean;

  @Column({ name: 'time_spent_seconds', nullable: true })
  timeSpentSeconds?: number;

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

  @ManyToOne(() => Question, (question) => question.attempts, { onDelete: 'CASCADE' })
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