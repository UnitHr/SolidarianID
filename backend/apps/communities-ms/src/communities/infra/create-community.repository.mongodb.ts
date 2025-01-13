import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { CreateCommunityRequestRepository } from '../repo/create-community.repository';
import { CreateCommunityRequestMapper } from '../mapper/CreateCommunityRequestMapper';
import { PaginationParams } from './filters/community-query.builder';
import {
  CreateCommunityFilter,
  CreateCommunitySort,
} from './filters/create-community-query.builder';

@Injectable()
export class CreateCommunityRequestRepositoryMongoDb extends CreateCommunityRequestRepository {
  constructor(
    @InjectModel(Persistence.CreateCommunityRequest.name)
    private readonly createCommunityModel: Model<Persistence.CreateCommunityRequest>,
  ) {
    super();
  }

  async findById(id: string): Promise<Domain.CreateCommunityRequest> {
    const existsRequest = await this.createCommunityModel.findOne({ id });

    if (!!existsRequest === true) {
      return CreateCommunityRequestMapper.toDomain(existsRequest);
    }

    return null;
  }

  async save(
    entity: Domain.CreateCommunityRequest,
  ): Promise<Domain.CreateCommunityRequest> {
    const existsRequest = await this.createCommunityModel.findOne({
      id: entity.id.toString(),
    });

    const document = CreateCommunityRequestMapper.toPersistence(entity);

    if (!!existsRequest === false) {
      return this.createCommunityModel
        .create(document)
        .then((doc) => CreateCommunityRequestMapper.toDomain(doc));
    }
    return this.createCommunityModel
      .updateOne({ id: entity.id.toString() }, document)
      .then(() => this.findById(entity.id.toString()));
  }

  async findAll(
    filter: CreateCommunityFilter,
    sort: CreateCommunitySort,
    pagination: PaginationParams,
  ): Promise<Domain.CreateCommunityRequest[]> {
    const requests = await this.createCommunityModel
      .find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .exec();

    return requests.map(CreateCommunityRequestMapper.toDomain);
  }

  async countDocuments(filter: CreateCommunityFilter): Promise<number> {
    return this.createCommunityModel.countDocuments(filter).exec();
  }
}
