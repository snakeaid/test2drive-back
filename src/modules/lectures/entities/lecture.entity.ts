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
import { LectureCategory } from './lecture-category.entity';
import { LectureProgress } from './lecture-progress.entity';

@Entity('lectures')
export class Lecture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => LectureCategory, (category) => category.lectures)
  @JoinColumn({ name: 'category_id' })
  category: LectureCategory;

  @Column({ name: 'category_id' })
  categoryId: string;

  @OneToMany(() => LectureProgress, (progress) => progress.lecture)
  userProgress: LectureProgress[];
} 