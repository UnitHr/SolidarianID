import { IsNumber, IsString } from 'class-validator';
import { CreateContributionDto } from './create-contribution.dto';

export class GoodsContributionDto extends CreateContributionDto {
  @IsString()
  goodType;

  @IsNumber()
  donatedQuantity;

  @IsString()
  unit;
}
