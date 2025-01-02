/**
 * @file This module exports the ActionAlreadyExistsError class.
 * @module modules/causes/exceptions/action-already-exists.error
 *
 * @description This class represents an error that is thrown when an action is already associated with a cause.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class ActionAlreadyExistsError extends BaseDomainError {
  constructor(actionId: string) {
    super(
      `The action with ID ${actionId} is already associated with this cause.`,
    );
  }
}
