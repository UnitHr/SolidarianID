import { Injectable } from '@nestjs/common';
import {
  ActionSortBy,
  PaginationDefaults,
  SortDirection,
} from '@common-lib/common-lib/common/enum';
import { EventPublisher } from '@nestjs/cqrs';
import { ActionService } from './action.service';
import * as Domain from '../domain';
import { ActionRepository } from '../action.repository';
import * as Exceptions from '../exceptions';
import { ActionFactory } from '../domain/ActionFactory';
import { ActionQueryBuilder } from '../infra/filters/action-query.builder';

@Injectable()
export class ActionServiceImpl implements ActionService {
  constructor(
    private readonly actionRepository: ActionRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async createAction(
    type: Domain.ActionType,
    title: string,
    description: string,
    causeId: string,
    target: number,
    unit: string,
    createdBy: string,
    communityId: string,
    goodType?: string,
    location?: string,
    date?: Date,
  ): Promise<string> {
    // Check for duplicate
    const isDuplicate = await this.duplicateCheck(causeId, title);
    if (isDuplicate) {
      throw new Exceptions.ActionTitleConflictError(title);
    }

    // Create the new action
    const action = this.eventPublisher.mergeObjectContext(
      ActionFactory.createAction(
        type,
        title,
        description,
        causeId,
        target,
        unit,
        createdBy,
        communityId,
        goodType,
        location,
        date,
      ),
    );

    // Save the new action in the repository
    const savedAction = await this.actionRepository.save(action);
    action.commit();

    return savedAction.id.toString();
  }

  async updateAction(
    id: string,
    title?: string,
    description?: string,
    target?: number,
  ): Promise<void> {
    // Find the existing action by Id
    const action = await this.actionRepository.findById(id);

    // Update action fields
    action.update(title, description, target);

    // Update the action in the repository
    await this.actionRepository.save(action);
  }

  async getActionDetails(id: string): Promise<Domain.Action> {
    // Find the action by Id
    const action = await this.actionRepository.findById(id);

    return action;
  }

  async getAllActions(
    nameFilter?: string,
    statusFilter?: Domain.ActionStatus,
    sortBy: ActionSortBy = ActionSortBy.TITLE,
    sortDirection: SortDirection = SortDirection.ASC,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<{ data: Domain.Action[]; total: number }> {
    const queryBuilder = new ActionQueryBuilder()
      .addNameFilter(nameFilter)
      .addStatusFilter(statusFilter)
      .addSort(sortBy, sortDirection)
      .addPagination(page, limit);

    const filters = queryBuilder.buildFilter();
    const sort = queryBuilder.buildSort();
    const pagination = queryBuilder.buildPagination();

    // Use Promise.all to execute both queries in parallel
    const [data, total] = await Promise.all([
      this.actionRepository.findAll(filters, sort, pagination), // Get paginated data
      this.actionRepository.countDocuments(filters), // Count total documents
    ]);

    return {
      data,
      total,
    };
  }

  async duplicateCheck(causeId: string, title: string): Promise<boolean> {
    // Check if an action with the same title already exists for the cause
    const existingActions = await this.actionRepository.findByCauseId(causeId);
    const actionWithTitle = existingActions.find(
      (action) =>
        action.title === title &&
        action.status !== Domain.ActionStatus.COMPLETED,
    );

    return !!actionWithTitle;
  }

  async makeContribution(
    userId: string,
    actionId: string,
    date: Date,
    amount: number,
    unit: string,
  ): Promise<string> {
    // Find the action by Id
    const action = this.eventPublisher.mergeObjectContext(
      await this.actionRepository.findById(actionId),
    );

    const contributionId = action.contribute(userId, date, amount, unit);
    await this.actionRepository.save(action);

    action.commit();
    return contributionId;
  }

  async getContributions(
    id: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<{ data: Domain.Contribution[]; total: number }> {
    // Find the action by Id
    const action = await this.actionRepository.findById(id);

    // Validate page and limit
    const validatedPage = Math.max(page, 1);
    const validatedLimit = Math.max(limit, 1);

    // Calculate the total number of contributions and the data to return
    const total = action.contributions.length;
    const skip = (validatedPage - 1) * validatedLimit;
    const data = action.contributions.slice(skip, skip + validatedLimit);

    return { data, total };
  }
}
