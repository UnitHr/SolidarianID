import { Field, InputType } from '@nestjs/graphql';
import { PASSWORD_PATTERN } from '@common-lib/common-lib/common/constant';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_PATTERN, {
    message:
      'The password must be longer than 8 characters and contain at least one symbol, one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  showAge?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  githubId?: string;
}
