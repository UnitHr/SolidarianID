import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateActionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  target?: number;
}
