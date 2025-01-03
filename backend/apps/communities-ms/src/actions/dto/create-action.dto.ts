import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ActionType } from '../domain/ActionType';

export class CreateActionDto {
  @IsEnum(ActionType, { message: 'Invalid action type' })
  type: ActionType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  causeId: string;

  @IsPositive()
  target: number;

  @IsString()
  unit: string;

  @ValidateIf((o) => o.type === ActionType.GOODS_COLLECTION)
  @IsString({ message: 'goodType must be a string' })
  @IsNotEmpty({ message: 'goodType is required for GoodsCollectionAction' })
  goodType?: string;

  @ValidateIf((o) => o.type === ActionType.VOLUNTEER)
  @IsString({ message: 'location must be a string' })
  @IsNotEmpty({ message: 'location is required for VolunteerAction' })
  location?: string;

  @ValidateIf((o) => o.type === ActionType.VOLUNTEER)
  @IsDate({ message: 'date must be a Date' })
  @IsNotEmpty({ message: 'date is required for VolunteerAction' })
  @Transform(({ value }) => new Date(value))
  date?: Date;
}

/*
export class CreateEconomicActionDto extends CreateActionDto {}

export class CreateGoodsCollectionActionDto extends CreateActionDto {
  @IsString()
  goodType: string;
}

export class CreateVolunteerActionDto extends CreateActionDto {
  @IsString()
  location: string;

  @IsDateString()
  date: Date;
} */

// export class UpdateTalDto extends PartialType(CreateActionDto) {}
