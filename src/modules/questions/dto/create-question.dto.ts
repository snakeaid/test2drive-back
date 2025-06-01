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
  ArrayMaxSize,
  MaxLength 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionDifficulty } from '../entities/question.entity';
import { CreateQuestionOptionDto } from './create-question-option.dto';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Question text',
    example: 'Що означає цей дорожній знак?',
  })
  @IsString()
  questionText: string;

  @ApiPropertyOptional({
    description: 'Question image URL (road sign, traffic situation, etc.)',
    example: 'https://example.com/road-sign.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  questionImageUrl?: string;

  @ApiProperty({
    description: 'Question difficulty level',
    enum: QuestionDifficulty,
    example: QuestionDifficulty.MEDIUM,
  })
  @IsEnum(QuestionDifficulty)
  difficulty: QuestionDifficulty;

  @ApiPropertyOptional({
    description: 'Explanation for the correct answer',
    example: 'Цей знак попереджає про небезпечний поворот направо',
  })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({
    description: 'Category UUID where question belongs',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Sort order within category',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Whether question is published',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({
    description: 'Question options (minimum 2, maximum 6)',
    type: [CreateQuestionOptionDto],
    example: [
      {
        optionLetter: 'A',
        optionText: 'Зупинитися перед знаком',
        isCorrect: true,
        sortOrder: 0
      },
      {
        optionLetter: 'B',
        optionText: 'Продовжити рух',
        isCorrect: false,
        sortOrder: 1
      }
    ],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options: CreateQuestionOptionDto[];
} 