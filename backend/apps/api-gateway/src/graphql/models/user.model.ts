import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { FollowerModel } from './follower.model';
import { FollowingModel } from './following.model';

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

  @Field(() => [FollowerModel], { nullable: true })
  followers?: FollowerModel[];

  @Field(() => [FollowingModel], { nullable: true })
  following?: FollowingModel[];

  @Field(() => Int, { nullable: true })
  followersCount?: number;

  @Field(() => Int, { nullable: true })
  followingCount?: number;
}
