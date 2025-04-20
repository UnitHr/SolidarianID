import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class UserCannotFollowSelfError extends BaseDomainError {
  constructor() {
    super(`User cannot follow self`);
  }
}
