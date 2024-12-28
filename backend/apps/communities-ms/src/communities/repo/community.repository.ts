import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from '../domain';

export abstract class CommunityRepository extends Repository<Domain.Community> {
  abstract findByName(name: string): Promise<Domain.Community>;
}
