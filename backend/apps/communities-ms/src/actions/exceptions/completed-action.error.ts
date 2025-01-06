import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class CompletedActionError extends BaseDomainError {
  constructor(id: string) {
    super(
      `The action with id "${id}" has been completed and no longer accepts contributions.`,
    );
  }
}
