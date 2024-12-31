import { StatusRequest } from '@communities-ms/communities/domain/StatusRequest';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
    ods: number[];
  };

  @Prop({ type: String, enum: StatusRequest })
  status: StatusRequest;

  @Prop()
  comment?: string;
}

export const CreateCommunityRequestSchema = SchemaFactory.createForClass(
  CreateCommunityRequest,
);
