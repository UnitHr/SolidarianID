/**
 * @file This module exports the InvalidDateProvidedError class.
 * @module core/exceptions/invalid-date-provided.error
 *
 * @description This class represents an error that is thrown when an invalid date is provided in the system.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from './base-domain.error';

export class InvalidDateProvidedError extends BaseDomainError {
  constructor(message?: string) {
    super(message || 'The provided date is invalid.');
  }
}
