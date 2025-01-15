import { StatusRequest } from '@communities-ms/communities/domain/StatusRequest';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class JoinCommunityRequest {
  @Prop({ index: true }) // For findById
  @Prop({ required: true, unique: true })
  id: string;

  @Prop()
  userId: string;

  @Prop({ index: true }) // For countDocuments
  communityId: string;

  @Prop()
  adminId: string;

  @Prop({ type: String, enum: StatusRequest })
  status: StatusRequest;

  @Prop()
  comment?: string;
}

export type JoinCommunityRequestDocument =
  HydratedDocument<JoinCommunityRequest>;

export const JoinCommunityRequestSchema =
  SchemaFactory.createForClass(JoinCommunityRequest);

JoinCommunityRequestSchema.index({ communityId: 1, status: 1 }); // For findAll (PENDING)
JoinCommunityRequestSchema.index({ userId: 1, communityId: 1 }); // For findByUserIdAndCommunityId
