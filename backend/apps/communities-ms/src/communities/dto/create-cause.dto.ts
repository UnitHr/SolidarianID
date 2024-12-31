import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsDate,
  ArrayNotEmpty,
  IsPositive,
} from 'class-validator';

export class CreateCauseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  end: Date;

  @IsArray({ message: 'ODS must be an array' })
  @ArrayNotEmpty({ message: 'ODS cannot be empty' })
  @IsPositive({ each: true, message: 'ODS must be a number' })
  ods: number[];
}
