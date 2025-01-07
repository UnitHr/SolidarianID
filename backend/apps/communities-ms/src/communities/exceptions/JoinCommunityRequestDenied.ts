import { DomainError } from '@common-lib/common-lib/core/exceptions/domain.error';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class JoinCommunityRequestDenied extends Result<DomainError> {
  private constructor(communityId: string, userId: string) {
    super(false, {
      message: `The user with ID ${userId} has already been denied access to the community with ID ${communityId} and cannot request access again.`,
    });
  }

  public static create(
    communityId: string,
    userId: string,
  ): JoinCommunityRequestDenied {
    return new JoinCommunityRequestDenied(communityId, userId);
  }
}
