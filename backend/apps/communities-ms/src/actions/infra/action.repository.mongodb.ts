import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions';
import * as Domain from '../domain';
import * as Persistence from './persistence';
import { ActionMapper } from '../mapper/action.mapper';
import { ActionRepository } from '../action.repository';
import {
  ActionFilter,
  ActionSort,
  PaginationParams,
} from './filters/action-query.builder';

@Injectable()
export class ActionRepositoryMongoDB extends ActionRepository {
  constructor(
    @InjectModel(Persistence.Action.name)
    private readonly actionModel: Model<Persistence.Action>,
  ) {
    super();
  }

  async save(entity: Domain.Action): Promise<Domain.Action> {
    const persistenceAction = ActionMapper.toPersistence(entity);

    const doc = await this.actionModel
      .findOneAndUpdate({ id: persistenceAction.id }, persistenceAction, {
        upsert: true,
        new: true,
      })
      .exec();
    return ActionMapper.toDomain(doc);
  }

  async findById(id: string): Promise<Domain.Action> {
    const action = await this.actionModel.findOne({ id }).exec();

    if (!action) {
      throw new EntityNotFoundError(`Action with id ${id} not found.`);
    }

    return ActionMapper.toDomain(action);
  }

  async findAll(
    filter: ActionFilter,
    sort: ActionSort,
    pagination: PaginationParams,
  ): Promise<Domain.Action[]> {
    const actions = await this.actionModel
      .find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .exec();
    return actions.map(ActionMapper.toDomain);
  }

  async countDocuments(filter: ActionFilter): Promise<number> {
    return this.actionModel.countDocuments(filter).exec();
  }

  async findByCauseId(causeId: string): Promise<Domain.Action[]> {
    const actions = await this.actionModel.find({ causeId }).exec();
    return actions.map(ActionMapper.toDomain);
  }
}
