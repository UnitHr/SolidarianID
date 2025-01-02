import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Cause {
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
    type: Number,
  })
  ods: ODSEnum[];

  @Prop({ required: true })
  communityId: string;

  @Prop()
  actionsIds: string[];

  @Prop()
  supportersIds: string[];
}

export const CauseSchema = SchemaFactory.createForClass(Cause);
