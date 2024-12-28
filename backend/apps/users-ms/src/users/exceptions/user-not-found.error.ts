/**
 * @file This module exports the UserNotFoundError class.
 * @module modules/users/exceptions/user-not-found.error
 *
 * @description This class represents an error that is thrown when a user is not found in the system.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class UserNotFoundError extends BaseDomainError {
  constructor() {
    super('User not found');
  }
}
