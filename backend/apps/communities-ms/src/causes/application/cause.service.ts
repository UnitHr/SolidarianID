import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { CauseSortBy, SortDirection } from '@common-lib/common-lib/common/enum';
import { Cause } from '../domain';

export abstract class CauseService {
  abstract getAllCauses(
    odsFilter?: ODSEnum[],
    nameFilter?: string,
    sortBy?: CauseSortBy,
    sortDirection?: SortDirection,
  ): Promise<Cause[]>;

  abstract createCause(
    title: string,
    description: string,
    ods: ODSEnum[],
    endDate: Date,
    communityId: string,
    createdBy: string,
  ): Promise<string>;

  abstract validateCauseEndDate(endDate: Date): boolean;

  abstract getCause(id: string): Promise<Cause>;

  abstract updateCause(
    id: string,
    description?: string,
    ods?: ODSEnum[],
  ): Promise<void>;

  abstract getCauseSupporters(id: string): Promise<string[]>;

  abstract addCauseSupporter(id: string, userId: string): Promise<void>;

  abstract getCauseActions(id: string): Promise<string[]>;

  abstract addCauseAction(): Promise<void>;
}
