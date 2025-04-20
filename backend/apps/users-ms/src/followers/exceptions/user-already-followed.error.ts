import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class UserAlreadyFollowedError extends BaseDomainError {
  constructor(id: string) {
    super(`User with id ${id} is already followed`);
  }
}
