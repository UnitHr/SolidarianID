/**
 * @file This module exports the SupporterAlreadyExistsError class.
 * @module modules/causes/exceptions/supporter-already-exists.error
 *
 * @description This class represents an error that is thrown when a user is already a supporter of a cause.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class SupporterAlreadyExistsError extends BaseDomainError {
  constructor(userId: string) {
    super(`The user with ID ${userId} is already a supporter of this cause.`);
  }
}
