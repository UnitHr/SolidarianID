import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { StatusRequest } from '../domain/StatusRequest';

export class ValidateCommunityDto {
  @IsString({ message: 'The status must be a string.' })
  @IsNotEmpty({ message: 'The status cannot be empty.' })
  @IsEnum(StatusRequest, {
    message: `The status must be either ${Object.values(StatusRequest).join(', ')}`,
  })
  status: StatusRequest;

  @IsString({ message: 'The comment must be a string.' })
  @IsOptional()
  comment?: string;
}
