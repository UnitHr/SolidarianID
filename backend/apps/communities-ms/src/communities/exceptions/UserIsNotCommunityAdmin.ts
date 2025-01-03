import { DomainError } from '@common-lib/common-lib/core/exceptions/DomainError';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class UserIsNotCommunityAdmin extends Result<DomainError> {
  private constructor(communityId: string, userId: string) {
    super(false, {
      message: `The user with ID ${userId} is not an admin of the community with ID ${communityId}.`,
    });
  }

  public static create(
    communityId: string,
    userId: string,
  ): UserIsNotCommunityAdmin {
    return new UserIsNotCommunityAdmin(communityId, userId);
  }
}
