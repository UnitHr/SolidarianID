import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions';
import { CauseRepository } from '../cause.repository';
import { CauseMapper } from '../cause.mapper';
import {
  CauseFilter,
  CauseSort,
  PaginationParams,
} from './filters/cause-query.builder';
import * as Domain from '../domain';
import * as Persistence from './persistence';

@Injectable()
export class CauseRepositoryMongoDB extends CauseRepository {
  constructor(
    @InjectModel(Persistence.Cause.name)
    private readonly causeModel: Model<Persistence.Cause>,
  ) {
    super();
  }

  async save(entity: Domain.Cause): Promise<Domain.Cause> {
    const persistenceCause = CauseMapper.toPersistence(entity);

    try {
      const doc = await this.causeModel
        .findOneAndUpdate(
          { id: persistenceCause.id }, // Search by id
          persistenceCause, // Data to store
          { upsert: true, new: true }, // Create if not found, return updated doc
        )
        .exec();

      return CauseMapper.toDomain(doc);
    } catch (error) {
      throw new Error(
        `[CauseRepositoryMongoDB] Error saving Cause: ${error.message}`,
      );
    }
  }

  async findById(id: string): Promise<Domain.Cause> {
    const cause = await this.causeModel.findOne({ id }).exec();

    if (!cause) {
      throw new EntityNotFoundError(`Cause with id ${id} not found.`);
    }

    return CauseMapper.toDomain(cause);
  }

  async findAll(
    filter: CauseFilter,
    sort: CauseSort,
    pagination: PaginationParams,
  ): Promise<Domain.Cause[]> {
    const causes = await this.causeModel
      .find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .exec();

    return causes.map(CauseMapper.toDomain);
  }

  async countDocuments(filter: CauseFilter): Promise<number> {
    return this.causeModel.countDocuments(filter).exec();
  }
}
