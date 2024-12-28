import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class InvalidPasswordError extends BaseDomainError {
  constructor() {
    super(
      'The password must be longer than 8 characters and contain at least one symbol, one uppercase letter, one lowercase letter, and one number.',
    );
  }
}
