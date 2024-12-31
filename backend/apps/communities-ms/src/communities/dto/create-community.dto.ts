import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCauseDto } from '@communities-ms/communities/dto/create-cause.dto';

export class CreateCommunityDto {
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty({ message: 'The name cannot be empty' })
  name: string;

  @IsString({ message: 'The description must be a string' })
  @IsNotEmpty({ message: 'The description cannot be empty' })
  description: string;

  @ValidateNested({ message: 'The cause must be a valid object' })
  @IsNotEmpty({ message: 'The cause cannot be empty' })
  @Type(() => CreateCauseDto)
  cause: CreateCauseDto;
}
