import { DomainError } from '@common-lib/common-lib/core/exceptions/domain.error';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class CommunityNameIsTaken extends Result<DomainError> {
  private constructor(communityName: string) {
    super(false, {
      message: `The community name ${communityName} has already been taken.`,
    });
  }

  public static create(communityName: string): CommunityNameIsTaken {
    return new CommunityNameIsTaken(communityName);
  }
}
