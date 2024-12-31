import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { CreateCommunityRequestRepository } from '../repo/create-community.repository';
import { CreateCommunityRequestMapper } from '../mapper/CreateCommunityRequestMapper';

@Injectable()
export class CreateCommunityRequestRepositoryMongoDb extends CreateCommunityRequestRepository {
  constructor(
    @InjectModel(Persistence.CreateCommunityRequest.name)
    private joinCommunityModel: Model<Persistence.CreateCommunityRequest>,
  ) {
    super();
  }

  async findById(id: string): Promise<Domain.CreateCommunityRequest> {
    const existsRequest = await this.joinCommunityModel.findOne({ id });

    if (!!existsRequest === true) {
      return CreateCommunityRequestMapper.toDomain(existsRequest);
    }

    return null;
  }

  async save(
    entity: Domain.CreateCommunityRequest,
  ): Promise<Domain.CreateCommunityRequest> {
    const existsRequest = await this.joinCommunityModel.findOne({
      id: entity.id.toString(),
    });

    const document = CreateCommunityRequestMapper.toPersistence(entity);

    if (!!existsRequest === false) {
      return this.joinCommunityModel
        .create(document)
        .then((doc) => CreateCommunityRequestMapper.toDomain(doc));
    }
    return this.joinCommunityModel
      .updateOne({ id: entity.id.toString() }, document)
      .then(() => this.findById(entity.id.toString()));
  }

  findAll(
    offset: number,
    limit: number,
  ): Promise<Domain.CreateCommunityRequest[]> {
    return this.joinCommunityModel
      .find()
      .skip(offset)
      .limit(limit)
      .then((docs) => docs.map(CreateCommunityRequestMapper.toDomain));
  }
}
