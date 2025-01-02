import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { Cause } from '../domain';

export abstract class CauseService {
  abstract getAllCauses(): Promise<Cause[]>;

  abstract createCause(
    title: string,
    description: string,
    ods: ODSEnum[],
    endDate: Date,
    communityId: string,
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
