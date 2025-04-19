import { Follower } from '../domain';

export abstract class FollowerService {
  abstract followUser(
    followedUserId: string,
    followerUserId: string,
  ): Promise<void>;

  abstract getUserFollowers(userId: string): Promise<Follower[]>;

  abstract isFollowing(
    followedUserId: string,
    followerUserId: string,
  ): Promise<boolean>;

  abstract countUserFollowers(userId: string): Promise<number>;
}
