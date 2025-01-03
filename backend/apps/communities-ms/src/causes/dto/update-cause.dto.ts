import { ODSEnum } from '@common-lib/common-lib/common/ods';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';

export class UpdateCauseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ODSEnum, { each: true })
  ods?: ODSEnum[];
}
