/**
 * @file This module exports the DomainError interface.
 * @module core/exceptions/DomainError
 *
 * @description This interface represents a domain error structure that can be used across the application.
 */

export interface DomainError {
  message: string;
  error?: unknown;
}
