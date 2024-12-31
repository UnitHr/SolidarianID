import { DomainError } from '@common-lib/common-lib/core/exceptions/DomainError';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class CompletedActionException extends Result<DomainError> {
  private constructor(id: string) {
    super(false, {
      message: `The action with id "${id}" is completed and does not accept any more contributions.`,
    });
  }

  public static create(id: string): CompletedActionException {
    return new CompletedActionException(id);
  }
}
