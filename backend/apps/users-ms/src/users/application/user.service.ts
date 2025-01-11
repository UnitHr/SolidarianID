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
  ): Promise<string>;

  abstract updateUser(id: string, email: string, bio: string): Promise<void>;

  abstract getUserProfile(id: string): Promise<User>;

  abstract getUserByEmail(email: string): Promise<User>;

  abstract followUser(id: string, followerId: string): Promise<void>;

  abstract getUserFollowers(id: string): Promise<User[]>;
}
