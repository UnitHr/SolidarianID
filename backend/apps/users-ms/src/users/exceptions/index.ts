/**
 * @file This module exports various user-related error classes.
 * @module modules/users/exceptions
 *
 * @description This module provides a collection of error classes that represent different user-related errors
 * in the system.
 */

import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions';
import { EmailAlreadyInUseError } from './email-already-in-use.error';
import { EmailUpdateConflictError } from './email-update-conflict.error';
import { UnderageUserError } from './under-age-user.error';
import { InvalidPasswordError } from './invalid-password.error';

export {
  MissingPropertiesError,
  EmailAlreadyInUseError,
  EmailUpdateConflictError,
  UnderageUserError,
  InvalidPasswordError,
};
