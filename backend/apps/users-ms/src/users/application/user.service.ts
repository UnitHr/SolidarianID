import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import { User } from '../domain';

export abstract class UserService {
  abstract createUser(
    firstName: string,
    lastName: string,
    birthDate: Date,
    email: string,
    password: string,
    bio: string,
    showAge: boolean,
    showEmail: boolean,
    githubId?: string,
    role?: Role,
  ): Promise<string>;

  abstract updateUser(id: string, email: string, bio: string): Promise<void>;

  abstract getUserProfile(id: string): Promise<User>;

  abstract getUserByEmail(email: string): Promise<User>;

  abstract findByGithubId(githubId: string): Promise<User>;

  abstract findUsersByRole(role: Role): Promise<User[]>;
}
