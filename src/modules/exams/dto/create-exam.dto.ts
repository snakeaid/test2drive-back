import { 
  IsString, 
  IsUUID, 
  IsOptional, 
  IsNumber, 
  IsBoolean, 
  IsArray, 
  ValidateNested, 
  ArrayMinSize,
  Min,
  Max,
  MaxLength 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestQuestionDto } from '../../tests/dto/create-test.dto';

export class CreateExamDto {
  @ApiProperty({
    description: 'Exam title',
    example: 'Офіційний іспит з правил дорожнього руху',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Exam description',
    example: 'Офіційний екзамен для отримання посвідчення водія категорії B',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Time limit in minutes (required for exams)',
    example: 20,
    minimum: 10,
    maximum: 180,
  })
  @IsNumber()
  @Min(10)
  @Max(180)
  timeLimitMinutes: number;

  @ApiPropertyOptional({
    description: 'Passing score percentage',
    example: 75,
    default: 75,
    minimum: 50,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(100)
  passingScorePercentage?: number;

  @ApiPropertyOptional({
    description: 'Question category UUID (optional filter)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Whether exam is published',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'Allow retries (default false for exams)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  allowRetries?: boolean;

  @ApiPropertyOptional({
    description: 'Show results immediately after completion',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  showResultsImmediately?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order for displaying exams',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({
    description: 'Questions for this exam (minimum 10, maximum 40)',
    type: [TestQuestionDto],
    example: [
      {
        questionId: '123e4567-e89b-12d3-a456-426614174000',
        questionOrder: 1,
        points: 1
      },
      {
        questionId: '123e4567-e89b-12d3-a456-426614174001',
        questionOrder: 2,
        points: 1
      }
    ],
  })
  @IsArray()
  @ArrayMinSize(10)
  @ValidateNested({ each: true })
  @Type(() => TestQuestionDto)
  questions: TestQuestionDto[];
} 