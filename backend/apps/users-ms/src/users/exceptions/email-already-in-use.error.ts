/**
 * @file This module exports the EmailAlreadyInUseError class.
 * @module modules/users/exceptions/email-already-in-use.error
 *
 * @description This class represents an error that is thrown when an email is already in use in the system.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class EmailAlreadyInUseError extends BaseDomainError {
  constructor(email: string) {
    super(`Email "${email}" is already in use`);
  }
}
