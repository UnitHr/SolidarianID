import { DomainError } from '@common-lib/common-lib/core/exceptions/domain.error';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class MissingPropertiesError extends Result<DomainError> {
  private constructor() {
    super(false, {
      message: `Properties are missing.`,
    });
  }

  public static create(): MissingPropertiesError {
    return new MissingPropertiesError();
  }
}
