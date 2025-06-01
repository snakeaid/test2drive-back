import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLectureCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Дорожні знаки',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Вивчення основних дорожніх знаків та їх значень',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Sort order for displaying categories',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
} 