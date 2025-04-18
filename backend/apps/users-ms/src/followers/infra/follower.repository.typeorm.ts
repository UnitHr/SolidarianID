import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions/entity-not-found.error';
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
      return null; // TODO maybe thrown an EntityNotFoundError
    }

    return FollowerMapper.toDomain(follower);
  }

  async findFollowers(followedId: string): Promise<Domain.Follower[]> {
    const followers = await this.followerRepository.findBy({ followedId });
    return followers.map(FollowerMapper.toDomain);
  }

  async countFollowers(followedId: string): Promise<number> {
    return this.followerRepository.countBy({ followedId });
  }

  async save(follower: Domain.Follower): Promise<Domain.Follower> {
    const persistenceFollower = FollowerMapper.toPersistence(follower);
    const savedFollower =
      await this.followerRepository.save(persistenceFollower);
    return FollowerMapper.toDomain(savedFollower);
  }
}
