import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Domain from '../domain';
import * as Persistence from './persistence';
import { ActionMapper } from '../mapper/action.mapper';
import { ActionRepository } from '../action.repository';

@Injectable()
export class ActionRepositoryMongoDB extends ActionRepository {
  constructor(
    @InjectModel(Persistence.Action.name)
    private actionModel: Model<Persistence.Action>,
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

  /*
  save = async (entity: Domain.Action): Promise<Domain.Action> => {
    return this.actionModel
      .create(ActionMapper.toPersistence(entity))
      .then((doc) => ActionMapper.toDomain(doc));
  };

  update = async (entity: Domain.Action): Promise<Domain.Action> => {
    return this.actionModel
      .findOneAndUpdate(
        { id: entity.id.toString() },
        ActionMapper.toPersistence(entity),
        { new: true },
      )
      .then((doc) => ActionMapper.toDomain(doc));
  }; */

  async findById(id: string): Promise<Domain.Action | null> {
    const action = await this.actionModel.findOne({ id }).exec();
    return action ? ActionMapper.toDomain(action) : null;
  }

  async delete(id: string): Promise<void> {
    await this.actionModel.deleteOne({ id }).exec();
  }

  async findAll(offset: number, limit: number): Promise<Domain.Action[]> {
    const actions = await this.actionModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec();
    return actions.map(ActionMapper.toDomain);
  }

  async findWithFilters(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, any>,
    offset: number,
    limit: number,
  ): Promise<{ data: Domain.Action[]; total: number }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (filters.title) {
      query.title = { $regex: filters.title, $options: 'i' };
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    const actions = await this.actionModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.actionModel.countDocuments(query);

    const data = actions.map(ActionMapper.toDomain);
    return { data, total };
  }

  async count(): Promise<number> {
    return this.actionModel.countDocuments();
  }

  async findByCauseId(causeId: string): Promise<Domain.Action[]> {
    const actions = await this.actionModel.find({ causeId }).exec();
    return actions.map(ActionMapper.toDomain);
  }
}
