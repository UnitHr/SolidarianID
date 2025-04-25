import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => Int, { nullable: true })
  followersCount?: number;

  @Field(() => Int, { nullable: true })
  followingCount?: number;
}
