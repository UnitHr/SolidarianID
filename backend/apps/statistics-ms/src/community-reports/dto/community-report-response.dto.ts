import { ODSDetail } from '@common-lib/common-lib/common/ods';

export class CommunityByCommunityIdResponseDto {
  communityId: string;

  communityName: string;

  adminId: string;

  members: number;

  ods: ODSDetail[];
}
