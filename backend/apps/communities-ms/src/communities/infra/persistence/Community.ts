import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommunityDocument =
  // eslint-disable-next-line no-use-before-define
  HydratedDocument<Community>;

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

export const CommunitySchema = SchemaFactory.createForClass(Community);
