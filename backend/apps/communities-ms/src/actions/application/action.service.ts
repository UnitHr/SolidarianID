import { Injectable } from '@nestjs/common';
import { Action } from '../domain/Action';
import { UpdateActionDto } from '../dto/update-action.dto';

@Injectable()
export abstract class ActionService {
  abstract createEconomicAction(
    title,
    description,
    causeId,
    targetAmount,
  ): Promise<{ id: string }>;

  abstract createGoodsCollectionAction(
    title,
    description,
    causeId,
    goodType,
    quantity,
    unit,
  ): Promise<{ id: string }>;

  abstract createVolunteerAction(
    title,
    description,
    causeId,
    targetVolunteers,
    location,
    date,
  ): Promise<{ id: string }>;

  abstract updateAction(id: string, updateActionDto: UpdateActionDto);

  abstract getActionDetails(id: string): Promise<Action>;

  abstract getAllActions(offset: number, limit: number): Promise<Action[]>;

  abstract getPaginatedActions(
    offset: number,
    limit: number,
  ): Promise<{ data: Action[]; total: number }>;

  abstract listActionsByCause(causeId: string): Promise<Action[]>;
}
