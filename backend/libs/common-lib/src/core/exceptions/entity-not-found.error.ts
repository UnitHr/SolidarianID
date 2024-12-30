/**
 * @file This module exports the EntityNotFoundError class.
 * @module core/exceptions/entity-not-found.error
 *
 * @description This class represents an error that is thrown when an entity is not found in the system.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from './base-domain.error';

export class EntityNotFoundError extends BaseDomainError {
  constructor(message: string) {
    super(message);
  }
}
