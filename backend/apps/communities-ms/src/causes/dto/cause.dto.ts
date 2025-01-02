import { ODSDetail } from '@common-lib/common-lib/common/ods';

export class CauseDto {
  id: string;

  title: string;

  description: string;

  ods: ODSDetail[];

  endDate: Date;

  communityId: string;

  createdBy: string;

  createdAt: Date;

  updatedAt: Date;
}
