import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FollowerModel {
  @Field(() => ID)
  followerId: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field(() => Date)
  followedAt: Date;
}
