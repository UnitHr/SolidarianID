/**
 * @file This module exports the UnderageUserError class.
 * @module modules/users/exceptions/under-age-user.error
 *
 * @description This class represents an error that is thrown when a user is under the required minimum age.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class UnderageUserError extends BaseDomainError {
  constructor(minAge: number) {
    super(`User must be at least ${minAge} years old`);
  }
}
