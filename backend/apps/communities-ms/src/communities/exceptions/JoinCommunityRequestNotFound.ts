import { DomainError } from '@common-lib/common-lib/core/exceptions/domain.error';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class JoinCommunityRequestNotFound extends Result<DomainError> {
  private constructor(id: string) {
    super(false, {
      message: `The join community request with id "${id}" does not exist.`,
    });
  }

  public static create(id: string): JoinCommunityRequestNotFound {
    return new JoinCommunityRequestNotFound(id);
  }
}
