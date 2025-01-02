import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class ActionNotFoundException extends BaseDomainError {
  constructor(id: string) {
    super(`The action with the id "${id}" does not exist.`);
  }
}

/*
import { DomainError } from '@common-lib/common-lib/core/exceptions/DomainError';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class ActionNotFoundException extends Result<DomainError> {
  private constructor(id: string) {
    super(false, {
      message: `The action with the id "${id}" does not exist.`,
    });
  }

  public static create(id: string): ActionNotFoundException {
    return new ActionNotFoundException(id);
  }
} */
