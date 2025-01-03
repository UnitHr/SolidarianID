import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class InvalidContributionUnitError extends BaseDomainError {
  constructor(id: string, unit: string, actionUnit: string) {
    super(
      `The action with the id "${id}" cannot accept contributions measured in "${unit}. Its units are mesured in "${actionUnit}".`,
    );
  }
}
