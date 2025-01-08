import { DomainError } from '@common-lib/common-lib/core/exceptions/domain.error';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class CommunityNotFound extends Result<DomainError> {
  private constructor(id: string) {
    super(false, {
      message: `The community with the id "${id}" does not exist.`,
    });
  }

  public static create(id: string): CommunityNotFound {
    return new CommunityNotFound(id);
  }
}
