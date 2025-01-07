/**
 * @file This module exports various user-related error classes.
 * @module core/exceptions
 *
 * @description This module provides a collection of error classes that represent different user-related errors
 * in the system.
 */

import { DomainError } from './domain.error';
import { BaseDomainError } from './base-domain.error';
import { EntityNotFoundError } from './entity-not-found.error';
import { InvalidDateProvidedError } from './invalid-date-provided.error';
import { MissingPropertiesError } from './missing-properties.error';

export {
  DomainError,
  BaseDomainError,
  EntityNotFoundError,
  InvalidDateProvidedError,
  MissingPropertiesError,
};
