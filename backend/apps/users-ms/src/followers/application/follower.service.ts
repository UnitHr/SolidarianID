import { Follower } from '../domain';

export abstract class FollowerService {
  abstract followUser(
    followedUserId: string,
    followerUserId: string,
  ): Promise<void>;

  abstract getUserFollowers(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ followers: Follower[]; total: number }>;

  abstract getUserFollowing(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ following: Follower[]; total: number }>;

  abstract isFollowing(
    followedUserId: string,
    followerUserId: string,
  ): Promise<boolean>;
}
