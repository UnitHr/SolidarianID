import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsDate,
  ArrayNotEmpty,
  IsEnum,
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

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ODSEnum, { each: true })
  ods?: ODSEnum[];
}
