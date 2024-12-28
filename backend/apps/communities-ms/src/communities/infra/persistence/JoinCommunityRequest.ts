import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Status } from '../../domain/Status';

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

  @Prop({ type: String, enum: Status })
  status: Status;

  @Prop()
  comment?: string;
}

export const JoinCommunityRequestSchema =
  SchemaFactory.createForClass(JoinCommunityRequest);
