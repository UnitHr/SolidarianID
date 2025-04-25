import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FollowingModel {
  @Field(() => ID)
  followedUserId: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field(() => Date)
  followedAt: Date;
}
