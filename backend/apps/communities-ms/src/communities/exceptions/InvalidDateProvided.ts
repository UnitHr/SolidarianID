import { DomainError } from '@common-lib/common-lib/core/exceptions/domain.error';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class InvalidDateProvided extends Result<DomainError> {
  private constructor(date: Date) {
    super(false, {
      message: `The provided date is invalid: ${date.toString()}`,
    });
  }

  public static create(date: Date): InvalidDateProvided {
    return new InvalidDateProvided(date);
  }
}
