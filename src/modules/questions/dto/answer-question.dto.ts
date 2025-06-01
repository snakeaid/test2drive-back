import { IsUUID, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnswerQuestionDto {
  @ApiProperty({
    description: 'Selected option UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  selectedOptionId: string;

  @ApiPropertyOptional({
    description: 'Time spent answering the question in seconds',
    example: 15,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  timeSpentSeconds?: number;
} 