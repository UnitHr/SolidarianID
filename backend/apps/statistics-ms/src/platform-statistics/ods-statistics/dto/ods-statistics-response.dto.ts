import { ODSDetail } from '@common-lib/common-lib/common/ods';

export class OdsStatisticsResponseDto {
  ods: ODSDetail;

  communitiesCount: number;

  causesCount: number;

  averageSupport: number;
}
