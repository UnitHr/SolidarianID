/**
 * @file This module exports the MissingPropertiesError class.
 * @module core/exceptions/missing-properties.error
 *
 * @description This class represents an error that is thrown when required properties are missing in the system.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from './base-domain.error';

export class MissingPropertiesError extends BaseDomainError {
  constructor(message: string) {
    super(message);
  }
}
