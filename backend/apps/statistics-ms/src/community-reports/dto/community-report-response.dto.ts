import { ODSDetail } from '@common-lib/common-lib/common/ods';
import { CauseReportResponseDto } from './cause-report-response.dto';

export class CommunityByCommunityIdResponseDto {
  communityId: string;

  communityName: string;

  adminId: string;

  members: number;

  ods: ODSDetail[];

  causes: CauseReportResponseDto[];
}
