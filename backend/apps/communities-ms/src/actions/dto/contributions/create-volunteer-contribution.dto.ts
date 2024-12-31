import { IsNumber, IsString } from 'class-validator';
import { CreateContributionDto } from './create-contribution.dto';

export class VolunteerContributionDto extends CreateContributionDto {
  @IsNumber()
  hoursContributed;

  @IsNumber()
  volunteerNumber;

  @IsString()
  task;

  @IsString()
  location;
}
