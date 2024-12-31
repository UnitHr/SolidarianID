import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateContributionDto {
  // @IsString()
  // type: 'economic' | 'food' | 'volunteer';

  @IsString()
  @IsNotEmpty()
  userId: string;

  /* @IsString()
  @IsNotEmpty()
  actionId: string; */

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
}
