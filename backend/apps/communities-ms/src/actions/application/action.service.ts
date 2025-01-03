import { Injectable } from '@nestjs/common';
import { Action } from '../domain/Action';
import { UpdateActionDto } from '../dto/update-action.dto';

@Injectable()
export abstract class ActionService {
  abstract createAction(
    type,
    title,
    description,
    causeId,
    target,
    unit,
    goodType,
    location,
    date,
  ): Promise<{ id: string }>;
  /* abstract createEconomicAction(
    title,
    description,
    causeId,
    type,
    target,
  ): Promise<{ id: string }>;

  abstract createGoodsCollectionAction(
    title,
    description,
    causeId,
    type,
    target,
    goodType,
  ): Promise<{ id: string }>;

  abstract createVolunteerAction(
    title,
    description,
    causeId,
    type,
    target,
    location,
    date,
  ): Promise<{ id: string }>; */

  abstract updateAction(id: string, updateActionDto: UpdateActionDto);

  abstract getActionDetails(id: string): Promise<Action>;

  abstract getAllActions(offset: number, limit: number): Promise<Action[]>;

  abstract getPaginatedActions(
    offset: number,
    limit: number,
  ): Promise<{ data: Action[]; total: number }>;

  abstract listActionsByCause(causeId: string): Promise<Action[]>;

  abstract makeContribution(
    userId: string,
    actionId: string,
    date: Date,
    amount: number,
    unit: string,
  ): Promise<{ id: string }>;
}
