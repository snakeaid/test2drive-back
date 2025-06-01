import { IsOptional, IsString, IsDateString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+380123456789',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User date of birth (ISO 8601 format)',
    example: '1995-05-15',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
} 