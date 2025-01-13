import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from '@communities-ms/causes/infra/filters/cause-query.builder';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { JoinCommunityRequestRepository } from '../repo/join-community.repository';
import { JoinCommunityRequestMapper } from '../mapper/JoinCommunityRequestMapper';
import { StatusRequest } from '../domain/StatusRequest';

@Injectable()
export class JoinCommunityRequestRepositoryMongoDb extends JoinCommunityRequestRepository {
  constructor(
    @InjectModel(Persistence.JoinCommunityRequest.name)
    private readonly joinCommunityModel: Model<Persistence.JoinCommunityRequest>,
  ) {
    super();
  }

  async findById(id: string): Promise<Domain.JoinCommunityRequest> {
    const existsRequest = await this.joinCommunityModel.findOne({ id });

    if (!!existsRequest === true) {
      return JoinCommunityRequestMapper.toDomain(existsRequest);
    }

    return null;
  }

  async save(
    entity: Domain.JoinCommunityRequest,
  ): Promise<Domain.JoinCommunityRequest> {
    const existsRequest = await this.joinCommunityModel.findOne({
      id: entity.id.toString(),
    });

    const document = JoinCommunityRequestMapper.toPersistence(entity);

    if (!!existsRequest === false) {
      return this.joinCommunityModel
        .create(document)
        .then((doc) => JoinCommunityRequestMapper.toDomain(doc));
    }
    return this.joinCommunityModel
      .updateOne({ id: entity.id.toString() }, document)
      .then(() => this.findById(entity.id.toString()));
  }

  async findAll(
    communityId: string,
    pagination: PaginationParams,
  ): Promise<Domain.JoinCommunityRequest[]> {
    const requests = await this.joinCommunityModel
      .find({ status: StatusRequest.PENDING, communityId })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .exec();

    return requests.map(JoinCommunityRequestMapper.toDomain);
  }

  async countDocuments(communityId: string): Promise<number> {
    return this.joinCommunityModel.countDocuments({ communityId }).exec();
  }

  async findByUserIdAndCommunityId(
    userId: string,
    communityId: string,
  ): Promise<Domain.JoinCommunityRequest> {
    const existsRequest = await this.joinCommunityModel.findOne({
      userId,
      communityId,
    });

    if (!!existsRequest === true) {
      return JoinCommunityRequestMapper.toDomain(existsRequest);
    }

    return null;
  }
}
