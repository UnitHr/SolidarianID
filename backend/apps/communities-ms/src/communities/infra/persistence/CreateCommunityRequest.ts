import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Ods } from '../../domain/Ods';
import { Status } from '../../domain/Status';

export type CreateCommunityRequestDocument =
  // eslint-disable-next-line no-use-before-define
  HydratedDocument<CreateCommunityRequest>;

@Schema()
export class CreateCommunityRequest {
  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  cause: {
    title: string;
    description: string;
    end: Date;
    ods: Ods[];
  };

  @Prop({ type: String, enum: Status })
  status: Status;

  @Prop()
  comment?: string;
}

export const CreateCommunityRequestSchema = SchemaFactory.createForClass(
  CreateCommunityRequest,
);
