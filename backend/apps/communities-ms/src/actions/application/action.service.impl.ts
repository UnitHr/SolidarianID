import { Injectable } from '@nestjs/common';
import {
  ActionSortBy,
  PaginationDefaults,
  SortDirection,
} from '@common-lib/common-lib/common/enum';
import { ActionService } from './action.service';
import * as Domain from '../domain';
import { ActionRepository } from '../action.repository';
import * as Exceptions from '../exceptions';
import { ActionFactory } from '../domain/ActionFactory';
import { ActionQueryBuilder } from '../infra/filters/action-query.builder';
import { ActionEventPublisher } from '../action.event-publisher';
import { ActionCreatedEvent } from '../domain/events/ActionCreatedEvent';

@Injectable()
export class ActionServiceImpl implements ActionService {
  constructor(
    private readonly actionRepository: ActionRepository,
    private eventPublisher: ActionEventPublisher,
  ) {}

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
  ): Promise<string> {
    // Check for duplicate
    const isDuplicate = await this.duplicateCheck(causeId, title);
    if (isDuplicate) {
      throw new Exceptions.ActionTitleConflictError(title);
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

    const id = savedAction.id.toString();

    // Create and publish the ActionCreatedEvent
    const event = new ActionCreatedEvent(
      id,
      savedAction.type,
      savedAction.title,
    );
    await this.eventPublisher.publish(event);

    return id;
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

    if (action.unit !== unit) {
      throw new Exceptions.InvalidContributionUnitError(
        actionId,
        unit,
        action.unit,
      );
    }

    // Check the action is not completed
    if (action.status === Domain.ActionStatus.COMPLETED) {
      throw new Exceptions.CompletedActionError(actionId);
    }

    const contribution = Domain.Contribution.create({
      userId,
      actionId,
      date,
      amount,
      unit,
    });

    // Publish the ActionContributedEvent
    const event = action.contribute(contribution);
    await this.actionRepository.save(action);

    await this.eventPublisher.publish(event);

    return contribution.id.toString();
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
