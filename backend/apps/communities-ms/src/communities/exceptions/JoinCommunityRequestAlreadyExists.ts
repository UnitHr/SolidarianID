import { DomainError } from '@common-lib/common-lib/core/exceptions/domain.error';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class JoinCommunityRequestAlreadyExists extends Result<DomainError> {
  private constructor(communityId: string, userId: string) {
    super(false, {
      message: `The user with ID ${userId} already has an existing request to join the community with ID ${communityId}.`,
    });
  }

  public static create(
    communityId: string,
    userId: string,
  ): JoinCommunityRequestAlreadyExists {
    return new JoinCommunityRequestAlreadyExists(communityId, userId);
  }
}
