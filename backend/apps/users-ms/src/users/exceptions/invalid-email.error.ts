import { BaseDomainError } from '@common-lib/common-lib/core/exceptions';

export class InvalidEmailError extends BaseDomainError {
  constructor(email: string) {
    super(`The email "${email}" is not valid`);
  }
}
