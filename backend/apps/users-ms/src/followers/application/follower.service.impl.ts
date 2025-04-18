import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { FollowerService } from './follower.service';
import { FollowerRepository } from '../follower.repository';
import { Follower } from '../domain';
import { UserAlreadyFollowedError } from '../exceptions/user-already-followed.error';
import { UserCannotFollowSelfError } from '../exceptions/user-cannot-follow-self.error';

@Injectable()
export class FollowerServiceImpl implements FollowerService {
  constructor(
    private readonly followerRepository: FollowerRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async followUser(
    followedUserId: string,
    followerUserId: string,
    followerName: string,
    followerEmail: string,
  ): Promise<void> {
    if (followedUserId === followerUserId) {
      throw new UserCannotFollowSelfError();
    }

    if (await this.isFollowing(followedUserId, followerUserId)) {
      throw new UserAlreadyFollowedError(followedUserId);
    }

    const follower = this.eventPublisher.mergeObjectContext(
      Follower.create({
        followerId: new UniqueEntityID(followerUserId),
        followedId: new UniqueEntityID(followedUserId),
        fullName: followerName,
        email: followerEmail,
        followedAt: new Date(),
      }),
    );

    await this.followerRepository.save(follower);
    follower.commit();
  }

  async getUserFollowers(userId: string): Promise<Follower[]> {
    return this.followerRepository.findFollowers(userId);
  }

  async isFollowing(
    followedUserId: string,
    followerUserId: string,
  ): Promise<boolean> {
    const follower = await this.followerRepository.find(
      followerUserId,
      followedUserId,
    );

    return follower !== null;
  }

  async countUserFollowers(userId: string): Promise<number> {
    return this.followerRepository.countFollowers(userId);
  }
}
