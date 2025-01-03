import { Injectable } from '@nestjs/common';
import { ActionService } from './action.service';
import { Action, ActionProps } from '../domain/Action';
import { ActionRepository } from '../action.repository';
import { ActionStatus, Contribution } from '../domain';
import { UpdateActionDto } from '../dto/update-action.dto';
import * as Exceptions from '../exceptions';
import { ActionFactory } from '../domain/ActionFactory';

@Injectable()
export class ActionServiceImpl implements ActionService {
  constructor(private readonly actionRepository: ActionRepository) {}

  async createAction(
    type,
    title,
    description,
    causeId,
    target,
    unit,
    goodType,
    location,
    date,
  ): Promise<{ id: string }> {
    // Check for duplicate
    const isDuplicate = await this.duplicateCheck(causeId, title);
    if (isDuplicate) {
      throw new Exceptions.ActionTitleConflictException(title);
    }

    // Create the new action
    const action = ActionFactory.createAction(
      type,
      title,
      description,
      causeId,
      target,
      unit,
      goodType,
      location,
      date,
    );

    // Save the new action in the repository
    const savedAction = await this.actionRepository.save(action);

    return { id: savedAction.id.toString() };
  }

  async updateAction(id: string, updateActionDto: UpdateActionDto) {
    // Find the existing action by Id
    const action = await this.actionRepository.findById(id);

    // Update action fields
    action.update(updateActionDto as unknown as ActionProps);

    // Update the action in the repository
    await this.actionRepository.save(action);
  }

  async getActionDetails(id: string): Promise<Action> {
    // Find the action by Id
    const action = await this.actionRepository.findById(id);

    return action;
  }

  async getAllActions(offset: number, limit: number): Promise<Action[]> {
    return this.actionRepository.findAll(offset, limit);
  }

  async getPaginatedActions(
    offset: number,
    limit: number,
  ): Promise<{ data: Action[]; total: number }> {
    const [data, total] = await Promise.all([
      this.actionRepository.findAll(offset, limit),
      this.actionRepository.count(),
    ]);

    return { data, total };
  }

  async listActionsByCause(causeId: string): Promise<Action[]> {
    // Find all actions defined for the cause
    const actions = await this.actionRepository.findByCauseId(causeId);

    if (!actions) {
      throw new Exceptions.InvalidCauseIdException(causeId);
    }

    return actions;
  }

  async duplicateCheck(causeId: string, title: string): Promise<boolean> {
    // Check if an action with the same title already exists for the cause
    const existingActions = await this.actionRepository.findByCauseId(causeId);
    const actionWithTitle = existingActions.find(
      (action) => action.title === title,
    );

    return !!actionWithTitle;
  }

  async makeContribution(
    userId: string,
    actionId: string,
    date: Date,
    amount: number,
    unit: string,
  ): Promise<{ id: string }> {
    // Find the action by Id
    const action = await this.actionRepository.findById(actionId);

    if (action.unit !== unit) {
      throw new Exceptions.InvalidContributionUnitException(actionId, unit);
    }

    // Check the action is not completed
    if (action.status === ActionStatus.completed) {
      throw new Exceptions.CompletedActionException(actionId);
    }

    const contribution = Contribution.create({
      userId,
      actionId,
      date,
      amount,
      unit,
    });

    action.contribute(contribution);
    await this.actionRepository.save(action);

    return { id: contribution.id.toString() };
  }
}
