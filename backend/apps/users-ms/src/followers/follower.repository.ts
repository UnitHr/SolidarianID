/**
 * @file This module exports the FollowerRepository class.
 * @module modules/followers/follower.repository
 */

import { Repository } from '@common-lib/common-lib/core/repository';
import * as Domain from './domain';

export abstract class FollowerRepository extends Repository<Domain.Follower> {
  abstract find(
    followerId: string,
    followedId: string,
  ): Promise<Domain.Follower | null>;

  abstract findFollowers(
    followedId: string,
    page?: number,
    limit?: number,
  ): Promise<[Domain.Follower[], number]>;

  abstract findFollowing(
    followerId: string,
    page?: number,
    limit?: number,
  ): Promise<[Domain.Follower[], number]>;
}
