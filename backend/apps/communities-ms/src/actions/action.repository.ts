import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from './domain';

export abstract class ActionRepository extends Repository<Domain.Action> {
  abstract count(): Promise<number>;

  // abstract update(entity: Domain.Action): Promise<Domain.Action>;

  abstract findAll(offset: number, limit: number): Promise<Domain.Action[]>;

  abstract findByCauseId(causeId: string): Promise<Domain.Action[]>;

  abstract findWithFilters(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, any>,
    offset: number,
    limit: number,
  ): Promise<{ data: Domain.Action[]; total: number }>;
}
