/**
 * @file This module exports the EmailUpdateConflictError class.
 * @module modules/users/exceptions/email-update-conflict.error
 *
 * @description This class represents an error that is thrown when the new email is the same as the current email.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class EmailUpdateConflictError extends BaseDomainError {
  constructor() {
    super('The new email must be different from the current email.');
  }
}
