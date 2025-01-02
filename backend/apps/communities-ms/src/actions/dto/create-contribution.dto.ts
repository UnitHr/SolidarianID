import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateContributionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  date: Date;

  @IsNumber()
  amount: number;

  @IsString()
  unit: string;
}
