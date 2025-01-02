import { ActionStatus } from '@communities-ms/actions/domain';
import { ActionType } from '@communities-ms/actions/domain/ActionType';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Contribution, ContributionSchema } from './Contribution';

@Schema({ discriminatorKey: 'type' })
export class Action {
  @Prop()
  id: string;

  @Prop({ type: String, enum: ActionStatus })
  status: ActionStatus;

  @Prop({ type: String, enum: ActionType })
  type: ActionType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  causeId: string;

  @Prop({ type: [ContributionSchema], default: [] })
  contributions: Contribution[];

  @Prop({ required: true })
  target: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  achieved: number;

  @Prop({ required: false })
  goodType?: string;

  @Prop({ required: false })
  location?: string;

  @Prop({ required: false })
  date?: Date;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
