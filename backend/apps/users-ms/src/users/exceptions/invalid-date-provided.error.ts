/**
 * @file This module exports the InvalidDateProvidedError class.
 * @module modules/users/exceptions/invalid-date-provided.error
 *
 * @description This class represents an error that is thrown when an invalid date is provided in the system.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class InvalidDateProvidedError extends BaseDomainError {
  constructor() {
    super('Invalid date provided');
  }
}
