/**
 * @file This module exports various user-related error classes.
 * @module modules/users/exceptions
 *
 * @description This module provides a collection of error classes that represent different user-related errors
 * in the system.
 */

import { EmailAlreadyInUseError } from './email-already-in-use.error';
import { EmailUpdateConflictError } from './email-update-conflict.error';
import { MissingUserPropertiesError } from './missing-user-properties.error';
import { UnderageUserError } from './under-age-user.error';
import { InvalidPasswordError } from './invalid-password.error';
import { UserAlreadyFollowedError } from './user-already-followed.error';
import { UserCannotFollowSelfError } from './user-cannot-follow-self.error';

export {
  EmailAlreadyInUseError,
  EmailUpdateConflictError,
  MissingUserPropertiesError,
  UnderageUserError,
  UserAlreadyFollowedError,
  InvalidPasswordError,
  UserCannotFollowSelfError,
};
