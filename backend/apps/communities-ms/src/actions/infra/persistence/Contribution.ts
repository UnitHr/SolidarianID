import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Contribution {
  @Prop()
  id: string;

  @Prop({ required: true })
  type: 'economic' | 'goodsCollection' | 'volunteer';

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  actionId: string;

  @Prop()
  date: Date;

  @Prop()
  description: string;

  @Prop({ required: false })
  donatedAmount?: number;

  @Prop({ required: false })
  goodType?: string;

  @Prop({ required: false })
  donatedQuantity?: number;

  @Prop({ required: false })
  unit?: string;

  @Prop({ required: false })
  volunteerNumber?: number;

  @Prop({ required: false })
  hoursContributed?: number;

  @Prop({ required: false })
  task?: string;

  @Prop({ required: false })
  location?: string;

  // details: any; // Ej: { amount: 100 }, { hours: 5 }, { items: ['Rice', 'Beans'] }
}

export const ContributionSchema = SchemaFactory.createForClass(Contribution);
