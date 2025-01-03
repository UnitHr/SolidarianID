import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from './domain';
import {
  ActionFilter,
  ActionSort,
  PaginationParams,
} from './infra/filters/action-query.builder';

export abstract class ActionRepository extends Repository<Domain.Action> {
  abstract findAll(
    filter: ActionFilter,
    sort: ActionSort,
    pagination: PaginationParams,
  ): Promise<Domain.Action[]>;

  abstract countDocuments(filter: ActionFilter): Promise<number>;

  abstract findByCauseId(causeId: string): Promise<Domain.Action[]>;
}
