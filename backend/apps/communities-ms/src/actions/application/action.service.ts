import { Injectable } from '@nestjs/common';
import { SortDirection } from 'typeorm';
import { ActionSortBy } from '@common-lib/common-lib/common/enum';
import { Action } from '../domain/Action';
import { ActionStatus, Contribution } from '../domain';

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
  ): Promise<string>;

  abstract updateAction(
    id: string,
    title?: string,
    description?: string,
    target?: number,
  ): Promise<void>;

  abstract getActionDetails(id: string): Promise<Action>;

  abstract getAllActions(
    nameFilter?: string,
    statusFilter?: ActionStatus,
    sortBy?: ActionSortBy,
    sortDirection?: SortDirection,
    page?: number,
    limit?: number,
  ): Promise<{ data: Action[]; total: number }>;

  abstract makeContribution(
    userId: string,
    actionId: string,
    date: Date,
    amount: number,
    unit: string,
  ): Promise<string>;

  abstract getContributions(
    id: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Contribution[]; total: number }>;
}
