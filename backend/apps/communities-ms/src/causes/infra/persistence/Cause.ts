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

  @Prop({ type: [Number] })
  ods: number[];

  @Prop({ required: true })
  communityId: string;

  @Prop()
  actions: string[];

  @Prop()
  supporters: string[];
}

export const CauseSchema = SchemaFactory.createForClass(Cause);
