/**
 * @file This module exports the NegativeCountError class.
 * @module platform-statistics/community-statistics/exceptions/negative-count.error
 *
 * @description This class represents an error that is thrown when a count is negative.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class NegativeCountError extends BaseDomainError {
  constructor(message: string) {
    super(message);
  }
}
