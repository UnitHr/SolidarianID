import { Repository } from '@common-lib/common-lib/core/repository';
import { CauseFilter, CauseSort } from './infra/filters/cause-query.builder';
import * as Domain from './domain';

export abstract class CauseRepository extends Repository<Domain.Cause> {
  abstract findAll(
    filter: CauseFilter,
    sort: CauseSort,
  ): Promise<Domain.Cause[]>;
}
