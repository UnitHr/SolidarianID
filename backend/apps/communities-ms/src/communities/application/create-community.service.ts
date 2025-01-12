import { Either } from '@common-lib/common-lib/core/logic/Either';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import { StatusRequest } from '../domain/StatusRequest';
import * as Domain from '../domain';
import * as Exceptions from '../exceptions';

export abstract class CreateCommunityService {
  abstract getCreateCommunityRequests(
    createdAtFilter?: Date,
    statusFilter?: StatusRequest,
    page?: number,
    limit?: number,
  ): Promise<{ data: Domain.CreateCommunityRequest[]; total: number }>;

  abstract getCreateCommunityRequest(
    id: string,
  ): Promise<
    Either<
      Exceptions.CreateCommunityRequestNotFound,
      Result<Domain.CreateCommunityRequest>
    >
  >;

  abstract validateCreateCommunityRequest(
    requestId: string,
    status: string,
    comment?: string,
  ): Promise<
    Either<
      Exceptions.CreateCommunityRequestNotFound | Exceptions.CommentIsMandatory,
      Result<Domain.Community> | Result<void>
    >
  >;
}
