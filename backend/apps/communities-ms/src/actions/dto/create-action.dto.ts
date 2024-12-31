/* eslint-disable max-classes-per-file */
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateActionDto {
  @IsString()
  type: 'economic' | 'food' | 'volunteer';

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  causeId: string;
}

export class CreateEconomicActionDto extends CreateActionDto {
  @IsNumber()
  targetAmount: number;
}

export class CreateGoodsCollectionActionDto extends CreateActionDto {
  @IsString()
  goodType: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  collectQuantity?: number;
}

export class CreateVolunteerActionDto extends CreateActionDto {
  @IsNumber()
  targetVolunteers: number;

  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  currentVolunteers?: number;

  @IsDateString()
  date: Date;
}

// export class UpdateTalDto extends PartialType(CreateActionDto) {}
