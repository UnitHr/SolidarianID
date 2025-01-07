import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Community {
  @Prop()
  id: string;

  @Prop()
  adminId: string;

  @Prop()
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
