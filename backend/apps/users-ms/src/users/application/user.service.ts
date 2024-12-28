import { User } from '../domain';

// TODO: Add tests
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
    role: string,
  ): Promise<string>;

  abstract updateUser(id: string, email: string, bio: string): Promise<void>;

  abstract getUserProfile(id: string): Promise<User>;

  abstract getUserByEmail(email: string): Promise<User>;
}
