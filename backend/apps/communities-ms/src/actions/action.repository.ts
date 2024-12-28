import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from './domain';

export abstract class ActionRepository extends Repository<Domain.Action> {
  abstract findByCauseId(causeId: string): Promise<Domain.Action[]>;

  abstract update(entity: Domain.Action): Promise<Domain.Action>;
}
