import { CreateUserInput } from '../models/inputs/create-user.input';
import { UserModel } from '../models/user.model';

export abstract class UserService {
  abstract getUserProfile(id: string): Promise<UserModel>;

  abstract countUserFollowing(id: string): Promise<number>;

  abstract countUserFollowers(id: string): Promise<number>;

  abstract createUser(createUserInput: CreateUserInput): Promise<string>;
}
