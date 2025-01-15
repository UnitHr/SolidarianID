import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Community {
  @Prop({ index: true }) // For findById
  @Prop({ required: true, unique: true })
  id: string;

  @Prop()
  adminId: string;

  @Prop({ index: true }) // For findByName
  name: string;

  @Prop()
  description: string;

  @Prop()
  members: string[];

  @Prop()
  causes: string[];
}

export type CommunityDocument = HydratedDocument<Community>;

export const CommunitySchema = SchemaFactory.createForClass(Community);

CommunitySchema.index({ adminId: 1, id: 1 }); // For isCommunityAdmin
