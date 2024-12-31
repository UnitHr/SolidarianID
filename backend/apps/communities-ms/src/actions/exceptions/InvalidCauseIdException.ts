import { DomainError } from '@common-lib/common-lib/core/exceptions/DomainError';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class InvalidCauseIdException extends Result<DomainError> {
  private constructor(causeId: string) {
    super(false, {
      message: `The cause with the id "${causeId}" does not exist or has no associated actions.`,
    });
  }

  public static create(causeId: string): InvalidCauseIdException {
    return new InvalidCauseIdException(causeId);
  }
}
