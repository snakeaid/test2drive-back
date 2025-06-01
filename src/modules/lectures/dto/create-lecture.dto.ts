import { IsString, IsUUID, IsOptional, IsNumber, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLectureDto {
  @ApiProperty({
    description: 'Lecture title',
    example: 'Попереджувальні знаки',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Lecture content in HTML format',
    example: '<h2>Попереджувальні знаки</h2><p>Попереджувальні знаки інформують водіїв про небезпечні ділянки дороги...</p>',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Category UUID where lecture belongs',
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
    description: 'Whether lecture is published',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
} 