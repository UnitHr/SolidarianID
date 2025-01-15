import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true }) // Handles createdAt and updatedAt automatically
export class Cause {
  @Prop({ index: true }) // For save, findById
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({
    required: true,
    enum: ODSEnum,
    type: [Number],
  })
  ods: ODSEnum[];

  @Prop({ required: true })
  communityId: string;

  @Prop({ type: [String], default: [] })
  actionsIds: string[];

  @Prop({ type: [String], default: [] })
  supportersIds: string[];

  @Prop({ required: true })
  createdBy: string;

  // These properties are automatically handled by the timestamps option
  readonly createdAt?: Date;

  readonly updatedAt?: Date;
}

export const CauseSchema = SchemaFactory.createForClass(Cause);

CauseSchema.index({ ods: 1, title: 1, createdAt: -1 }); // For findAll
