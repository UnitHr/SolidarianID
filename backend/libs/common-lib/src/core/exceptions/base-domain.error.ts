/**
 * @file This module exports the BaseDomainError class.
 * @module core/exceptions/base-domain.error
 *
 * @description This abstract class serves as a base for all domain-specific errors in the application.
 * It extends the native JavaScript Error class and ensures that the error name and stack trace
 * are correctly maintained.
 */

export abstract class BaseDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintain the correct error trace
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
