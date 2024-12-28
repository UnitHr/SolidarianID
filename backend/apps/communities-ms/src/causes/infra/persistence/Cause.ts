import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Cause {
  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  communityId: string;

  @Prop({ type: [Number] })
  ods: number[];
}

export const CauseSchema = SchemaFactory.createForClass(Cause);
