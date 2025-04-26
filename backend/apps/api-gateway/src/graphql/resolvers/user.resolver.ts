import {
  Resolver,
  Query,
  Args,
  ID,
  ResolveField,
  Parent,
  Int,
  Mutation,
} from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import { CreateUserInput } from '../models/inputs/create-user.input';
import { UserService } from '../application/user.service';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel, { name: 'user' })
  async getUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserModel> {
    const user = await this.userService.getUserProfile(id);
    return {
      id,
      ...user,
    };
  }

  @Mutation(() => UserModel, { name: 'createUser' })
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserModel> {
    const userId = await this.userService.createUser(createUserInput);
    const user = await this.userService.getUserProfile(userId);
    return {
      id: userId,
      ...user,
    };
  }

  @ResolveField(() => Int, { nullable: true })
  async followersCount(@Parent() user: UserModel): Promise<number> {
    return this.userService.countUserFollowers(user.id);
  }

  @ResolveField(() => Int, { nullable: true })
  async followingCount(@Parent() user: UserModel): Promise<number> {
    return this.userService.countUserFollowing(user.id);
  }
}
