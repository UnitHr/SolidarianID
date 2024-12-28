import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';

export class UpdateCauseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  ods?: number[];
}
