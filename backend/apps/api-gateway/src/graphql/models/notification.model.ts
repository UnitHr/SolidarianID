import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationModel {
  @Field(() => ID)
  id: string;

  @Field()
  read: boolean;

  @Field()
  timestamp: Date;

  @Field(() => ID)
  recipientId: string;

  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => ID, { nullable: true })
  entityId?: string;

  @Field(() => String, { nullable: true })
  entityName?: string;
}
