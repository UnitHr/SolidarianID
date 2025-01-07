import { DomainError } from '@common-lib/common-lib/core/exceptions/domain.error';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class CreateCommunityRequestNotFound extends Result<DomainError> {
  private constructor(id: string) {
    super(false, {
      message: `The create community request with id "${id}" does not exist.`,
    });
  }

  public static create(id: string): CreateCommunityRequestNotFound {
    return new CreateCommunityRequestNotFound(id);
  }
}
