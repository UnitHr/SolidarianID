import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Domain from '../domain';
import * as Persistence from './persistence';
import { CauseRepository } from '../cause.repository';
import { CauseMapper } from '../cause.mapper';

@Injectable()
export class CauseRepositoryMongoDB extends CauseRepository {
  constructor(
    @InjectModel(Persistence.Cause.name)
    private causeModel: Model<Persistence.Cause>,
  ) {
    super();
  }

  getAllCauses(): Promise<Domain.Cause[]> {
    return this.causeModel
      .find()
      .exec()
      .then((docs) => docs.map(CauseMapper.toDomain));
  }

  save = async (entity: Domain.Cause): Promise<Domain.Cause> => {
    return this.causeModel
      .create(CauseMapper.toPersistence(entity))
      .then((doc) => CauseMapper.toDomain(doc));
  };

  // TODO: Review if we can update using the save method
  update = async (entity: Domain.Cause): Promise<Domain.Cause> => {
    return this.causeModel
      .findOneAndUpdate(
        { id: entity.id.toString() },
        CauseMapper.toPersistence(entity),
        { new: true },
      )
      .then((doc) => CauseMapper.toDomain(doc));
  };

  findById(id: string): Promise<Domain.Cause | null> {
    return this.causeModel
      .findOne({ id })
      .exec()
      .then((doc) => (doc ? CauseMapper.toDomain(doc) : null));
  }

  findByCommunityId(communityId: string): Promise<Domain.Cause[]> {
    return this.causeModel
      .find({ communityId })
      .exec()
      .then((docs) => docs.map(CauseMapper.toDomain));
  }

  findAll(): Promise<Domain.Cause[]> {
    return this.causeModel
      .find()
      .exec()
      .then((docs) => docs.map(CauseMapper.toDomain));
  }
}
