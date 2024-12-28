import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from '../domain';

export abstract class JoinCommunityRequestRepository extends Repository<Domain.JoinCommunityRequest> {
  abstract findAll(
    offset: number,
    limit: number,
  ): Promise<Domain.JoinCommunityRequest[]>;

  abstract findByUserIdAndCommunityId(
    userId: string,
    communityId: string,
  ): Promise<Domain.JoinCommunityRequest>;
}
