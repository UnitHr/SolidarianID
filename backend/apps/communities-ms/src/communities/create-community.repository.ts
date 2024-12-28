import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from './domain';

export abstract class CreateCommunityRequestRepository extends Repository<Domain.CreateCommunityRequest> {}
