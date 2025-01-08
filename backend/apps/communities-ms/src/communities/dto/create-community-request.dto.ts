import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { StatusRequest } from '../domain/StatusRequest';

export class CreateCommunityRequestDto {
  id: string;

  userId: string;

  communityName: string;

  communityDescription: string;

  causeTitle: string;

  causeDescription: string;

  causeEndDate: Date;

  causeOds: ODSEnum[];

  status: StatusRequest;

  createdAt?: Date;

  comment?: string;
}
