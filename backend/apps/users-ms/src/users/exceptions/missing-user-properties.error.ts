/**
 * @file This module exports the MissingUserPropertiesError class.
 * @module modules/users/exceptions/missing-user-properties.error
 *
 * @description This class represents an error that is thrown when required user properties are missing.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class MissingUserPropertiesError extends BaseDomainError {
  constructor() {
    super('Missing required user properties');
  }
}
