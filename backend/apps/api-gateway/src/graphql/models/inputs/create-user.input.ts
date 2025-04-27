import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@InputType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  @Type(() => Date)
  birthDate: Date;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  showAge?: boolean;

  @Field({ nullable: true })
  showEmail?: boolean;

  @Field({ nullable: true })
  githubId?: string;
}
