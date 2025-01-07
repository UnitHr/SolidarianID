import { Repository } from '@common-lib/common-lib/core/repository';
import { PaginationParams } from '@communities-ms/causes/infra/filters/cause-query.builder';
import * as Domain from '../domain';

export abstract class JoinCommunityRequestRepository extends Repository<Domain.JoinCommunityRequest> {
  abstract findAll(
    communityId: string,
    pagination: PaginationParams,
  ): Promise<Domain.JoinCommunityRequest[]>;

  abstract findByUserIdAndCommunityId(
    userId: string,
    communityId: string,
  ): Promise<Domain.JoinCommunityRequest>;

  abstract countDocuments(communityId: string): Promise<number>;
}
