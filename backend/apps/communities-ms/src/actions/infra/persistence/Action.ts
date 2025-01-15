import { ActionStatus } from '@communities-ms/actions/domain';
import { ActionType } from '@communities-ms/actions/domain/ActionType';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Contribution, ContributionSchema } from './Contribution';

@Schema({ timestamps: true }) // Handles createdAt and updatedAt automatically
export class Action {
  @Prop({ index: true }) // For save, findById
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, type: String, enum: ActionStatus })
  status: ActionStatus;

  @Prop({ required: true, type: String, enum: ActionType })
  type: ActionType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ index: true }) // For save, findByCauseId
  @Prop({ required: true, unique: true })
  causeId: string;

  @Prop({ type: [ContributionSchema], default: [] })
  contributions: Contribution[];

  @Prop({ required: true })
  target: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  achieved: number;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  communityId: string;

  // These properties are automatically handled by the timestamps option
  readonly createdAt?: Date;

  readonly updatedAt?: Date;

  @Prop({ required: false })
  goodType?: string;

  @Prop({ required: false })
  location?: string;

  @Prop({ required: false })
  date?: Date;
}

export const ActionSchema = SchemaFactory.createForClass(Action);

ActionSchema.index({ status: 1, title: 1, createdAt: -1, type: 1 }); // For findAll
