import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { CauseSortBy, SortDirection } from '@common-lib/common-lib/common/enum';
import { ActionType } from '@communities-ms/actions/domain/ActionType';
import { Cause } from '../domain';

export abstract class CauseService {
  abstract getAllCauses(
    odsFilter?: ODSEnum[],
    nameFilter?: string,
    sortBy?: CauseSortBy,
    sortDirection?: SortDirection,
    page?: number,
    limit?: number,
  ): Promise<{
    data: Cause[];
    total: number;
  }>;

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

  abstract getCauseSupporters(
    id: string,
    page?: number,
    limit?: number,
  ): Promise<{
    data: string[];
    total: number;
  }>;

  abstract addCauseSupporter(id: string, userId: string): Promise<void>;

  abstract getCauseActions(id: string): Promise<string[]>;

  abstract addCauseAction(
    type: ActionType,
    title: string,
    description: string,
    causeId: string,
    target: number,
    unit: string,
    createdBy: string,
    goodType?: string,
    location?: string,
    date?: Date,
  ): Promise<string>;
}
