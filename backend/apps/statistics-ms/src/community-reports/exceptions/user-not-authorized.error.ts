/**
 * @file This module exports the UserNotAuthorizedError class.
 * @module community-reports/exceptions/user-not-authorized.error
 *
 * @description This class represents an error that is thrown when a user attempts to access a resource without sufficient permissions.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class UserNotAuthorizedError extends BaseDomainError {
  constructor() {
    super('Unauthorized access');
  }
}
