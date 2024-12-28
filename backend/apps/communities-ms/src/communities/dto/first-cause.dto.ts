import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Ods } from '../domain/Ods';

export class FirstCauseDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @IsDate({ message: 'End date must be a valid date' })
  @IsNotEmpty({ message: 'End date cannot be empty' })
  @Type(() => Date)
  end: Date;

  @IsArray({ message: 'ODS must be an array' })
  @ArrayNotEmpty({ message: 'ODS cannot be empty' })
  @IsEnum(Ods, { each: true, message: 'Each ODS must be a valid value' })
  ods: Ods[];
}
