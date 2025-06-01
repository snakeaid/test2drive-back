import { 
  IsString, 
  IsUUID, 
  IsOptional, 
  IsNumber, 
  IsBoolean, 
  IsEnum, 
  IsArray, 
  ValidateNested, 
  ArrayMinSize,
  Min,
  Max,
  MaxLength 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestType } from '../entities/test.entity';

export class TestQuestionDto {
  @ApiProperty({
    description: 'Question UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  questionId: string;

  @ApiProperty({
    description: 'Order of question in test (starting from 1)',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  questionOrder: number;

  @ApiPropertyOptional({
    description: 'Points for this question',
    example: 1,
    default: 1,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  points?: number;
}

export class CreateTestDto {
  @ApiProperty({
    description: 'Test title',
    example: 'Тест з дорожніх знаків',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Test description',
    example: 'Перевірка знань основних дорожніх знаків України',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Test type',
    enum: TestType,
    example: TestType.PRACTICE,
  })
  @IsEnum(TestType)
  type: TestType;

  @ApiPropertyOptional({
    description: 'Time limit in minutes (null for no limit)',
    example: 20,
    minimum: 1,
    maximum: 180,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(180)
  timeLimitMinutes?: number;

  @ApiPropertyOptional({
    description: 'Passing score percentage',
    example: 70,
    default: 70,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
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
    description: 'Whether test is published',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'Allow retries',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  allowRetries?: boolean;

  @ApiPropertyOptional({
    description: 'Show results immediately after completion',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  showResultsImmediately?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order for displaying tests',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({
    description: 'Questions for this test (minimum 1, maximum 100)',
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
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TestQuestionDto)
  questions: TestQuestionDto[];
} 