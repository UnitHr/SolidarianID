import { DomainError } from '@common-lib/common-lib/core/exceptions/domain.error';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class UserDoNotManageCommunities extends Result<DomainError> {
  private constructor() {
    super(false, {
      message: `User does not manage any communities`,
    });
  }

  public static create(): UserDoNotManageCommunities {
    return new UserDoNotManageCommunities();
  }
}
