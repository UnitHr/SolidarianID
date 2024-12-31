import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from './domain';

export abstract class CauseRepository extends Repository<Domain.Cause> {
  abstract findAll(): Promise<Domain.Cause[]>;

  abstract update(entity: Domain.Cause): Promise<Domain.Cause>;
}
