import { DomainError } from '@common-lib/common-lib/core/exceptions/domain.error';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class UserIsAlreadyMember extends Result<DomainError> {
  private constructor(communityId: string, userId: string) {
    super(false, {
      message: `The user with ID ${userId} is already a member of the community with ID ${communityId}.`,
    });
  }

  public static create(
    communityId: string,
    userId: string,
  ): UserIsAlreadyMember {
    return new UserIsAlreadyMember(communityId, userId);
  }
}
