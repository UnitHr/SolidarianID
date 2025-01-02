import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class InvalidContributionUnitException extends BaseDomainError {
  constructor(id: string, unit: string) {
    super(
      `The action with the id "${id}" does not exist cannot accept contributions measured in "${unit}.`,
    );
  }
}

/*
import { DomainError } from '@common-lib/common-lib/core/exceptions/DomainError';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class InvalidContributionTypeException extends Result<DomainError> {
  private constructor(type: string, actionId: string) {
    super(false, {
      message: `A contribution of the type "${type}" is not valid for the action with id "${actionId}".`,
    });
  }

  public static create(
    type: string,
    actionId: string,
  ): InvalidContributionTypeException {
    return new InvalidContributionTypeException(type, actionId);
  }
}
*/
