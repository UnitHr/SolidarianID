import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class ActionTitleConflictException extends BaseDomainError {
  constructor(title: string) {
    super(`An action with the title "${title}" already exists for this cause.`);
  }
}

/*
import { DomainError } from '@common-lib/common-lib/core/exceptions/DomainError';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class ActionTitleConflictException extends Result<DomainError> {
  private constructor(title: string) {
    super(false, {
      message: `An action with the title "${title}" already exists for this cause.`,
    });
  }

  public static create(title: string): ActionTitleConflictException {
    return new ActionTitleConflictException(title);
  }
}
*/
