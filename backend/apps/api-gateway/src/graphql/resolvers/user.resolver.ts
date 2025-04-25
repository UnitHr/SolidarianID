import {
  Resolver,
  Query,
  Args,
  ID,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

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

  @ResolveField(() => Int, { nullable: true })
  async followersCount(@Parent() user: UserModel): Promise<number> {
    return this.userService.countUserFollowers(user.id);
  }

  @ResolveField(() => Int, { nullable: true })
  async followingCount(@Parent() user: UserModel): Promise<number> {
    return this.userService.countUserFollowing(user.id);
  }
}
