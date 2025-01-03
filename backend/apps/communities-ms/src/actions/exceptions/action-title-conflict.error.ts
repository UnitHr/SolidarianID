import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class ActionTitleConflictError extends BaseDomainError {
  constructor(title: string) {
    super(
      `An active action with the title "${title}" already exists for this cause.`,
    );
  }
}
