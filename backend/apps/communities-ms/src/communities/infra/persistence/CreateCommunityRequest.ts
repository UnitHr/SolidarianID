import { ODSEnum } from '@common-lib/common-lib/common/ods';
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

  @Prop({
    type: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      end: { type: Date, required: true },
      ods: { type: [Number], required: true, enum: ODSEnum },
    },
  })
  cause: {
    title: string;
    description: string;
    end: Date;
    ods: ODSEnum[];
  };

  @Prop({ type: String, enum: StatusRequest })
  status: StatusRequest;

  @Prop()
  createdAt: Date;

  @Prop()
  comment?: string;
}

export const CreateCommunityRequestSchema = SchemaFactory.createForClass(
  CreateCommunityRequest,
);
