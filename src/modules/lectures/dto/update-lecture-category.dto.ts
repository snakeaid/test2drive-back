import { PartialType } from '@nestjs/swagger';
import { CreateLectureCategoryDto } from './create-lecture-category.dto';

export class UpdateLectureCategoryDto extends PartialType(CreateLectureCategoryDto) {} 