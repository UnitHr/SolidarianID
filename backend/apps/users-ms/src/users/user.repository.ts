/**
 * @file This module exports the UserRepository class.
 * @module modules/users/user.repository
 *
 * @description This abstract class serves as a base for the user repository implementation in the application.
 */

import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from './domain';

export abstract class UserRepository extends Repository<Domain.User> {
  abstract findByEmail(email: string): Promise<Domain.User>;
}
