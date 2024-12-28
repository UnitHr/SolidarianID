import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActionRepository } from '../action.repository';
import * as Domain from '../domain';
import * as Persistence from './persistence';
import { ActionMapper } from '../action.mapper';

@Injectable()
export class ActionRepositoryMongoDB extends ActionRepository {
  constructor(
    @InjectModel(Persistence.Action.name)
    private actionModel: Model<Persistence.Action>,
  ) {
    super();
  }

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
  };

  async findById(id: string): Promise<Domain.Action | null> {
    const action = await this.actionModel.findOne({ id }).exec();
    return action ? ActionMapper.toDomain(action) : null;
  }

  async findByCauseId(causeId: string): Promise<Domain.Action[]> {
    const actions = await this.actionModel.find({ causeId }).exec();
    return actions.map(ActionMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.actionModel.deleteOne({ id }).exec();
  }
}
