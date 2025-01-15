import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { StatusRequest } from '@communities-ms/communities/domain/StatusRequest';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class CreateCommunityRequest {
  @Prop({ index: true }) // For findById
  @Prop({ required: true, unique: true })
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

export type CreateCommunityRequestDocument =
  HydratedDocument<CreateCommunityRequest>;

export const CreateCommunityRequestSchema = SchemaFactory.createForClass(
  CreateCommunityRequest,
);

CreateCommunityRequestSchema.index({ status: 1, createdAt: -1 }); // For findAll
