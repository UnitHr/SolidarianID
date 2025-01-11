import { ODSEnum } from '@common-lib/common-lib/common/ods';
import * as Domain from '../domain';

export abstract class OdsStatisticsService {
  abstract getAll(): Promise<Domain.OdsStatistics[]>;

  abstract getTotalSupports(): Promise<number>;

  abstract registerCauseCreation(
    ods: Set<ODSEnum>,
    communityId: string,
  ): Promise<void>;

  abstract registerCauseSupport(ods: Set<ODSEnum>): Promise<void>;
}
