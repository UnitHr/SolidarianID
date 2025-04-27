import {
  Resolver,
  Query,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { CommunityModel } from '../models/community.model';
import { UserModel } from '../models/user.model';
import { UserService } from '../application/user.service';
import { CommunityService } from '../application/community.service';

@Resolver(() => CommunityModel)
export class CommunityResolver {
  private readonly logger = new Logger(CommunityResolver.name);

  constructor(
    private readonly communityService: CommunityService,
    private readonly userService: UserService,
  ) {}

  @Query(() => CommunityModel, { name: 'community' })
  async getCommunity(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CommunityModel> {
    this.logger.debug(`Fetching community with ID: ${id}`);
    return this.communityService.getCommunity(id);
  }

  @ResolveField('admin', () => UserModel, { nullable: true })
  async getAdmin(@Parent() community: CommunityModel): Promise<UserModel> {
    this.logger.debug(`Fetching admin for community: ${community.id}`);
    const admin = await this.userService.getUserProfile(community.adminId);
    return {
      id: community.adminId,
      ...admin,
    };
  }
}
