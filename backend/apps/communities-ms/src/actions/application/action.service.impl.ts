import { Injectable } from '@nestjs/common';
import { ActionService } from './action.service';
import { Action, ActionProps } from '../domain/Action';
import { ActionRepository } from '../action.repository';
import {
  EconomicAction,
  GoodsCollectionAction,
  VolunteerAction,
} from '../domain';
import { UpdateActionDto } from '../dto/update-action.dto';
import * as Exceptions from '../exceptions';

@Injectable()
export class ActionServiceImpl implements ActionService {
  constructor(private readonly actionRepository: ActionRepository) {}

  async createEconomicAction(
    title,
    description,
    causeId,
    targetAmount,
  ): Promise<{ id: string }> {
    // Check for duplicate
    const isDuplicate = await this.duplicateCheck(causeId, title);
    if (isDuplicate) {
      Exceptions.ActionTitleConflictException.create(title);
    }

    // Create the new action
    const action = EconomicAction.create({
      title,
      description,
      causeId,
      targetAmount,
    });

    // Save the new action in the repository
    const savedAction = await this.actionRepository.save(action);

    return { id: savedAction.id.toString() };
  }

  async createGoodsCollectionAction(
    title,
    description,
    causeId,
    goodType,
    quantity,
    unit,
  ): Promise<{ id: string }> {
    // Check for duplicate
    this.duplicateCheck(causeId, title);

    // Create the new action
    const action = GoodsCollectionAction.create({
      title,
      description,
      causeId,
      goodType,
      quantity,
      unit,
    });

    // Save the new action in the repository
    const savedAction = await this.actionRepository.save(action);

    return { id: savedAction.id.toString() };
  }

  async createVolunteerAction(
    title,
    description,
    causeId,
    targetVolunteers,
    location,
    date,
  ): Promise<{ id: string }> {
    // Check for duplicate
    this.duplicateCheck(causeId, title);

    // Create the new action
    const action = VolunteerAction.create({
      title,
      description,
      causeId,
      targetVolunteers,
      location,
      date,
    });

    // Save the new action in the repository
    const savedAction = await this.actionRepository.save(action);

    return { id: savedAction.id.toString() };
  }

  async updateAction(id: string, updateActionDto: UpdateActionDto) {
    // Find the existing action by Id
    const action = await this.actionRepository.findById(id);

    if (!action) {
      Exceptions.ActionNotFoundException.create(id);
    }

    // Update action fields
    action.update(updateActionDto as unknown as ActionProps);

    // Update the action in the repository
    await this.actionRepository.update(action);
  }

  async getActionDetails(id: string): Promise<Action> {
    // Find the action by Id
    const action = await this.actionRepository.findById(id);

    if (!action) {
      Exceptions.ActionNotFoundException.create(id);
    }

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
      Exceptions.InvalidCauseIdException.create(causeId);
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
}
