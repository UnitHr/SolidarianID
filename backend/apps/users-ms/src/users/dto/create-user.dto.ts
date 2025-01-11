import { PASSWORD_PATTERN } from '@common-lib/common-lib/common/constant';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_PATTERN, {
    message:
      'The password must be longer than 8 characters and contain at least one symbol, one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bio?: string;

  @IsOptional()
  showAge?: boolean;

  @IsOptional()
  showEmail?: boolean;
}
