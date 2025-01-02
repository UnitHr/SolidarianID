import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Contribution {
  @Prop()
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  actionId: string;

  @Prop()
  date: Date;

  @Prop({ required: true })
  amount?: number;

  @Prop({ required: true })
  unit: string;
}

export const ContributionSchema = SchemaFactory.createForClass(Contribution);
