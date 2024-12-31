import { StatusRequest } from '@communities-ms/communities/domain/StatusRequest';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JoinCommunityRequestDocument =
  // eslint-disable-next-line no-use-before-define
  HydratedDocument<JoinCommunityRequest>;

@Schema()
export class JoinCommunityRequest {
  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  communityId: string;

  @Prop({ type: String, enum: StatusRequest })
  status: StatusRequest;

  @Prop()
  comment?: string;
}

export const JoinCommunityRequestSchema =
  SchemaFactory.createForClass(JoinCommunityRequest);
