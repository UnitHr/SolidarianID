import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// import { ObjectId } from 'mongodb';

@Schema({ discriminatorKey: 'type' })
export class Action {
  @Prop()
  id: string;

  @Prop({ required: true })
  status: 'pending' | 'in_progress' | 'completed';

  @Prop({ required: true })
  type: 'economic' | 'food' | 'volunteer';

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  causeId: string;

  @Prop({ required: false })
  targetAmount?: number;

  @Prop({ required: false })
  currentAmount?: number;

  @Prop({ required: false })
  foodType?: string;

  @Prop({ required: false })
  quantity?: number;

  @Prop({ required: false })
  unit?: string;

  @Prop({ required: false })
  collectedQuantity?: number;

  @Prop({ required: false })
  targetVolunteers?: number;

  @Prop({ required: false })
  currentVolunteers?: number;

  @Prop({ required: false })
  location?: string;

  @Prop({ required: false })
  date?: Date;
}

export const ActionSchema = SchemaFactory.createForClass(Action);

export type ActionDocument = HydratedDocument<Action>;
