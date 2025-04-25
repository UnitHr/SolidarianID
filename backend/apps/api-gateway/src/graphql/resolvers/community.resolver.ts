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
import { CommunityService } from '../services/community.service';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';

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
    const response = await this.communityService.getCommunity(id);
    return { ...response.data };
  }

  @ResolveField('admin', () => UserModel, { nullable: true })
  async getAdmin(@Parent() community: CommunityModel): Promise<UserModel> {
    const admin = await this.userService.getUserProfile(community.adminId);
    return {
      id: community.adminId,
      ...admin,
    };
  }
}
