import { Injectable } from '@nestjs/common';
import {
  EconomicAction,
  EconomicContribution,
  GoodsContribution,
  VolunteerContribution,
} from '../domain';
import { ActionRepository } from '../action.repository';
import { ContributionService } from './contribution.service';
import * as Exceptions from '../exceptions';

@Injectable()
export class ContributionServiceImpl implements ContributionService {
  constructor(private readonly actionRepository: ActionRepository) {}

  async makeEconomicContribution(
    userId: string,
    actionId: string,
    date: Date,
    donatedAmount: number,
    description?: string,
  ): Promise<{ id: string }> {
    // Find the action by Id
    const action = await this.actionRepository.findById(actionId);

    if (!action) {
      Exceptions.ActionNotFoundException.create(actionId);
    }

    // Check the contribution type matches the action type
    if (!(action instanceof EconomicAction)) {
      Exceptions.InvalidContributionTypeException.create('economic', actionId);
    }

    // Check the action is not completed
    if (action.status === 'completed') {
      Exceptions.CompletedActionException.create(actionId);
    }

    const contribution = EconomicContribution.create({
      userId,
      actionId,
      date,
      description,
      donatedAmount,
    });

    action.contribute(contribution);
    await this.actionRepository.update(action);

    return { id: contribution.id.toString() };
  }

  // TODO: add exceptions
  async makeGoodsCollectionContribution(
    userId: string,
    actionId: string,
    date: Date,
    goodType: string,
    donatedQuantity: number,
    unit: string,
    description?: string,
  ): Promise<{ id: string }> {
    const action = await this.actionRepository.findById(actionId);

    const contribution = GoodsContribution.create({
      userId,
      actionId,
      date,
      description,
      goodType,
      donatedQuantity,
      unit,
    });

    action.contribute(contribution);
    await this.actionRepository.update(action);

    return { id: contribution.id.toString() };
  }

  // TODO: add exceptions
  async makeVolunteerContribution(
    userId: string,
    actionId: string,
    date: Date,
    volunteerNumber: number,
    hoursContributed: number,
    task: string,
    location: string,
    description?: string,
  ): Promise<{ id: string }> {
    const action = await this.actionRepository.findById(actionId);

    const contribution = VolunteerContribution.create({
      userId,
      actionId,
      date,
      description,
      hoursContributed,
      volunteerNumber,
      task,
      location,
    });

    action.contribute(contribution);
    await this.actionRepository.update(action);

    return { id: contribution.id.toString() };
  }
}
