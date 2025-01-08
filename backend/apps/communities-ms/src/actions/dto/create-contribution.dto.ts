import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateContributionDto {
  @IsDateString()
  date: Date;

  @IsNumber()
  amount: number;

  @IsString()
  unit: string;
}
