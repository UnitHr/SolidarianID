import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { Status } from '../domain/Status';

export class ValidateCommunityDto {
  @IsString({ message: 'The status must be a string.' })
  @IsNotEmpty({ message: 'The status cannot be empty.' })
  @IsEnum(Status, {
    message: 'The status must be either "APPROVED" or "DENIED".',
  })
  status: Status;

  @IsString({ message: 'The comment must be a string.' })
  @IsOptional()
  comment?: string;
}
