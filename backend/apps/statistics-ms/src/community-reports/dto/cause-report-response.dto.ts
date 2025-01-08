import { ODSDetail } from '@common-lib/common-lib/common/ods';
import { ActionReportResponseDto } from './action-report-response.dto';

export class CauseReportResponseDto {
  causeId: string;

  causeName: string;

  supports: number;

  ods: ODSDetail[];

  actions: ActionReportResponseDto[];
}
