import { DomainError } from '@common-lib/common-lib/core/exceptions/DomainError';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class InvalidSearchException extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
    });
  }

  public static create(message: string): InvalidSearchException {
    return new InvalidSearchException(message);
  }
}
