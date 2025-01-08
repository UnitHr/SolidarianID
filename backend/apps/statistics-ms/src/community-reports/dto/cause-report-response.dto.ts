import { ODSDetail } from '@common-lib/common-lib/common/ods';

export class CauseReportResponseDto {
  causeId: string;

  causeName: string;

  supports: number;

  ods: ODSDetail[];
}
