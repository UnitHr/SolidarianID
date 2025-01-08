import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from './domain';

export abstract class HistoryRepository extends Repository<Domain.History> {
  abstract findByUserId(userId: string): Promise<Domain.History>;
}
