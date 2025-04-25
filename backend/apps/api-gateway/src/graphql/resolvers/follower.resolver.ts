import { Resolver, Query, Args, ID, Int } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { FollowerModel } from '../models/follower.model';
import { FollowingModel } from '../models/following.model';

@Resolver(() => FollowerModel)
export class FollowerResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [FollowerModel], { name: 'followers', nullable: true })
  async getUserFollowers(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<FollowerModel[]> {
    const response = await this.userService.getUserFollowers(
      userId,
      page,
      limit,
    );
    return response.data;
  }

  @Query(() => [FollowingModel], { name: 'following', nullable: true })
  async getUserFollowing(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<FollowingModel[]> {
    const response = await this.userService.getUserFollowing(
      userId,
      page,
      limit,
    );
    return response.data;
  }
}
