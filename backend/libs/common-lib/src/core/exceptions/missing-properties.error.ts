import { BaseDomainError } from './base-domain.error';

export class MissingPropertiesError extends BaseDomainError {
  constructor(message: string) {
    super(message);
  }
}
