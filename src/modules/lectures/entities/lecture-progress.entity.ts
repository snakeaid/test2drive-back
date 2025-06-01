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
import { Lecture } from './lecture.entity';

@Entity('lecture_progress')
@Unique(['userId', 'lectureId'])
export class LectureProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_at', nullable: true })
  completedAt?: Date;

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

  @ManyToOne(() => Lecture, (lecture) => lecture.userProgress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lecture_id' })
  lecture: Lecture;

  @Column({ name: 'lecture_id' })
  lectureId: string;
} 