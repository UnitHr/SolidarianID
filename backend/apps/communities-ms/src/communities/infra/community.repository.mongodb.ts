import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CommunityRepository } from '../repo/community.repository';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { CommunityMapper } from '../mapper/CommunityMapper';
import {
  CommunityFilter,
  PaginationParams,
} from './filters/community-query.builder';

@Injectable()
export class CommunityRepositoryMongoDb extends CommunityRepository {
  constructor(
    @InjectModel(Persistence.Community.name)
    private readonly communityModel: Model<Persistence.Community>,
  ) {
    super();
  }

  async findByName(name: string): Promise<Domain.Community> {
    const existsCommunity = await this.communityModel.findOne({ name });

    if (!!existsCommunity === true) {
      return CommunityMapper.toDomain(existsCommunity);
    }

    return null;
  }

  async isCommunityAdmin(
    userId: string,
    communityId: string,
  ): Promise<boolean> {
    const existsCommunity = await this.communityModel.findOne({
      adminId: userId,
      id: communityId,
    });

    if (!!existsCommunity === true) {
      return true;
    }

    return false;
  }

  async findById(id: string): Promise<Domain.Community> {
    const existsCommunity = await this.communityModel.findOne({ id });

    if (!!existsCommunity === true) {
      return CommunityMapper.toDomain(existsCommunity);
    }

    return null;
  }

  async save(entity: Domain.Community): Promise<Domain.Community> {
    const existsCommunity = await this.communityModel.findOne({
      id: entity.id.toString(),
    });

    const document = CommunityMapper.toPersistence(entity);

    if (!!existsCommunity === false) {
      return this.communityModel
        .create(document)
        .then((doc) => CommunityMapper.toDomain(doc));
    }
    return this.communityModel
      .updateOne({ id: entity.id.toString() }, document)
      .then(() => this.findById(entity.id.toString()));
  }

  async findAll(
    filter: CommunityFilter,
    pagination: PaginationParams,
  ): Promise<Domain.Community[]> {
    const communities = await this.communityModel
      .find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .exec();

    return communities.map(CommunityMapper.toDomain);
  }

  async countDocuments(filter: CommunityFilter): Promise<number> {
    return this.communityModel.countDocuments(filter).exec();
  }
}
