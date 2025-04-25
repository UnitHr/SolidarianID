/**
 * @file This module exports the UserRepository class.
 * @module modules/users/user.repository
 *
 * @description This abstract class serves as a base for the user repository implementation in the application.
 */

import { Repository } from '@common-lib/common-lib/core/repository';
import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import * as Domain from './domain';

export abstract class UserRepository extends Repository<Domain.User> {
  abstract findByEmail(email: string): Promise<Domain.User>;

  abstract findByGithubId(githubId: string): Promise<Domain.User>;

  abstract findByRole(role: Role): Promise<Domain.User[]>;
}
