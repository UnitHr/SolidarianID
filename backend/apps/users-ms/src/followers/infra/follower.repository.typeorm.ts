import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions/entity-not-found.error';
import { PaginationDefaults } from '@common-lib/common-lib/common/enum';
import { FollowerRepository } from '../follower.repository';
import * as Domain from '../domain';
import * as Persistence from './persistence';
import { FollowerMapper } from '../follower.mapper';

@Injectable()
export class FollowerRepositoryTypeOrm extends FollowerRepository {
  constructor(
    @InjectRepository(Persistence.Follower)
    private readonly followerRepository: TypeOrmRepository<Persistence.Follower>,
  ) {
    super();
  }

  async findById(id: string): Promise<Domain.Follower> {
    const follower = await this.followerRepository.findOneBy({ id });
    if (!follower) {
      throw new EntityNotFoundError(`Follower with ID ${id} not found`);
    }
    return FollowerMapper.toDomain(follower);
  }

  async find(
    followerId: string,
    followedId: string,
  ): Promise<Domain.Follower | null> {
    const follower = await this.followerRepository.findOneBy({
      followerId,
      followedId,
    });

    if (!follower) {
      return null;
    }

    return FollowerMapper.toDomain(follower);
  }

  async findFollowers(
    followedId: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<[Domain.Follower[], number]> {
    const [followers, total] = await this.followerRepository.findAndCount({
      where: { followedId },
      skip: (page - 1) * limit,
      take: limit,
      order: { followedAt: 'DESC' },
    });

    return [followers.map(FollowerMapper.toDomain), total];
  }

  async findFollowing(
    followerId: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<[Domain.Follower[], number]> {
    const [following, total] = await this.followerRepository.findAndCount({
      where: { followerId },
      skip: (page - 1) * limit,
      take: limit,
      order: { followedAt: 'DESC' },
    });

    return [following.map(FollowerMapper.toDomain), total];
  }

  async countFollowers(followedId: string): Promise<number> {
    return this.followerRepository.countBy({ followedId });
  }

  async countFollowing(followerId: string): Promise<number> {
    return this.followerRepository.countBy({ followerId });
  }

  async save(follower: Domain.Follower): Promise<Domain.Follower> {
    const persistenceFollower = FollowerMapper.toPersistence(follower);
    const savedFollower =
      await this.followerRepository.save(persistenceFollower);
    return FollowerMapper.toDomain(savedFollower);
  }
}
