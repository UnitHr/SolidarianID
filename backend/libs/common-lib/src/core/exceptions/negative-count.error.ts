/**
 * @file This module exports the NegativeCountError class.
 * @module common-lib/core/exceptions/negative-count.error
 *
 * @description This class represents an error that is thrown when a count is negative.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from './base-domain.error';

export class NegativeCountError extends BaseDomainError {
  constructor(message: string) {
    super(message);
  }
}
