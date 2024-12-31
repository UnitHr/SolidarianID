import { IsNumber } from 'class-validator';
import { CreateContributionDto } from './create-contribution.dto';

export class EconomicContributionDto extends CreateContributionDto {
  @IsNumber()
  donatedAmount: number;
}
