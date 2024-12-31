import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsPositive,
} from 'class-validator';

export class UpdateCauseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsArray({ message: 'ODS must be an array' })
  @ArrayNotEmpty({ message: 'ODS cannot be empty' })
  @IsPositive({ each: true, message: 'ODS must be a number' })
  ods?: number[];
}
