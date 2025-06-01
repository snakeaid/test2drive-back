import { IsString, IsBoolean, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuestionOptionDto {
  @ApiProperty({
    description: 'Option letter (A, B, C, D)',
    example: 'A',
    maxLength: 1,
  })
  @IsString()
  @MaxLength(1)
  optionLetter: string;

  @ApiProperty({
    description: 'Option text or image/GIF URL',
    example: 'Зупинитися перед знаком',
  })
  @IsString()
  optionText: string;

  @ApiProperty({
    description: 'Whether this option is correct',
    example: true,
  })
  @IsBoolean()
  isCorrect: boolean;

  @ApiPropertyOptional({
    description: 'Sort order within question',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
} 