import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { UserService } from '@users-ms/users/application/user.service';
import { FollowerService } from './follower.service';
import { FollowerRepository } from '../follower.repository';
import { Follower } from '../domain';
import { UserAlreadyFollowedError } from '../exceptions/user-already-followed.error';
import { UserCannotFollowSelfError } from '../exceptions/user-cannot-follow-self.error';

@Injectable()
export class FollowerServiceImpl implements FollowerService {
  constructor(
    private readonly followerRepository: FollowerRepository,
    private readonly userService: UserService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async followUser(
    followedUserId: string,
    followerUserId: string,
  ): Promise<void> {
    if (followedUserId === followerUserId) {
      throw new UserCannotFollowSelfError();
    }

    if (await this.isFollowing(followedUserId, followerUserId)) {
      throw new UserAlreadyFollowedError(followedUserId);
    }

    const followedUser = await this.userService.getUserProfile(followedUserId);
    const followerUser = await this.userService.getUserProfile(followerUserId);

    const follower = this.eventPublisher.mergeObjectContext(
      Follower.create(
        {
          followerId: new UniqueEntityID(followerUserId),
          followedId: new UniqueEntityID(followedUserId),
          fullName: followerUser.fullName,
          email: followerUser.email,
          followedAt: new Date(),
        },
        undefined,
        followedUser.email,
      ),
    );

    await this.followerRepository.save(follower);
    follower.commit();
  }

  async getUserFollowers(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ followers: Follower[]; total: number }> {
    const [followers, total] = await this.followerRepository.findFollowers(
      userId,
      page,
      limit,
    );
    return { followers, total };
  }

  async isFollowing(
    followedUserId: string,
    followerUserId: string,
  ): Promise<boolean> {
    const follower = await this.followerRepository.find(
      followerUserId,
      followedUserId,
    );
    return !!follower;
  }

  async countUserFollowers(userId: string): Promise<number> {
    return this.followerRepository.countFollowers(userId);
  }
}
