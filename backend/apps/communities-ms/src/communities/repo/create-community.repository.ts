import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from '../domain';
import {
  CreateCommunityFilter,
  CreateCommunitySort,
  PaginationParams,
} from '../infra/filters/create-community-query.builder';

export abstract class CreateCommunityRequestRepository extends Repository<Domain.CreateCommunityRequest> {
  abstract findAll(
    filter: CreateCommunityFilter,
    sort: CreateCommunitySort,
    pagination: PaginationParams,
  ): Promise<Domain.CreateCommunityRequest[]>;

  abstract countDocuments(filter: CreateCommunityFilter): Promise<number>;
}
