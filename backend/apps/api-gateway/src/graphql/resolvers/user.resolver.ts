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
import { FollowerModel } from '../models/follower.model';
import { FollowingModel } from '../models/following.model';

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

  @ResolveField(() => [FollowerModel], { nullable: true })
  async followers(
    @Parent() user: UserModel,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<FollowerModel[]> {
    const response = await this.userService.getUserFollowers(
      user.id,
      page,
      limit,
    );
    return response.data;
  }

  @ResolveField(() => [FollowingModel], { nullable: true })
  async following(
    @Parent() user: UserModel,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<FollowingModel[]> {
    const response = await this.userService.getUserFollowing(
      user.id,
      page,
      limit,
    );
    return response.data;
  }

  @ResolveField(() => Int, { nullable: true })
  async followersCount(@Parent() user: UserModel): Promise<number> {
    const response = await this.userService.getUserFollowers(user.id, 1, 1);
    return response.meta.total;
  }

  @ResolveField(() => Int, { nullable: true })
  async followingCount(@Parent() user: UserModel): Promise<number> {
    const response = await this.userService.getUserFollowing(user.id, 1, 1);
    return response.meta.total;
  }
}
