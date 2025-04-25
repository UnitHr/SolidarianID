import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from './user.model';

@ObjectType()
export class CommunityModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => ID)
  adminId: string;

  @Field(() => UserModel)
  admin: UserModel;
}
