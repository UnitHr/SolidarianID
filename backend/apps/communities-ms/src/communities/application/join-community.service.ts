import { Either } from '@common-lib/common-lib/core/logic/Either';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import * as Domain from '../domain';
import * as Exceptions from '../exceptions';

export abstract class JoinCommunityService {
  abstract joinCommunityRequest(
    userId: string,
    communityId: string,
  ): Promise<
    Either<
      | Exceptions.JoinCommunityRequestAlreadyExists
      | Exceptions.JoinCommunityRequestDenied
      | Exceptions.UserIsAlreadyMember
      | Exceptions.CommunityNotFound,
      Result<Domain.JoinCommunityRequest>
    >
  >;

  abstract getJoinCommunityRequests(
    communityId: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Domain.JoinCommunityRequest[]; total: number }>;

  abstract getJoinCommunityRequest(
    id: string,
  ): Promise<
    Either<
      Exceptions.JoinCommunityRequestNotFound,
      Result<Domain.JoinCommunityRequest>
    >
  >;

  abstract validateJoinCommunityRequest(
    requestId: string,
    status: string,
    comment?: string,
  ): Promise<
    Either<
      Exceptions.JoinCommunityRequestNotFound | Exceptions.CommentIsMandatory,
      Result<void>
    >
  >;

  abstract isCommunityAdmin(
    userId: string,
    communityId: string,
  ): Promise<boolean>;
}
