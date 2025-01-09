import { Injectable, Logger } from '@nestjs/common';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import {
  CauseSortBy,
  PaginationDefaults,
  SortDirection,
} from '@common-lib/common-lib/common/enum';
import { ActionService } from '@communities-ms/actions/application/action.service';
import { ActionType } from '@communities-ms/actions/domain';
import { EventPublisher } from '@nestjs/cqrs';
import { CauseRepository } from '../cause.repository';
import { CauseService } from './cause.service';
import { Cause, CauseEndDate } from '../domain';
import { CauseQueryBuilder } from '../infra/filters/cause-query.builder';

@Injectable()
export class CauseServiceImpl implements CauseService {
  constructor(
    private readonly causeRepository: CauseRepository,
    private readonly actionService: ActionService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  logger = new Logger(CauseServiceImpl.name);

  async getAllCauses(
    odsFilter?: ODSEnum[],
    nameFilter?: string,
    sortBy: CauseSortBy = CauseSortBy.TITLE,
    sortDirection: SortDirection = SortDirection.ASC,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<{
    data: Cause[];
    total: number;
  }> {
    const queryBuilder = new CauseQueryBuilder()
      .addOdsFilter(odsFilter)
      .addNameFilter(nameFilter)
      .addSort(sortBy, sortDirection)
      .addPagination(page, limit);

    const filters = queryBuilder.buildFilter();
    const sort = queryBuilder.buildSort();
    const pagination = queryBuilder.buildPagination();

    // Use Promise.all to execute both queries in parallel
    const [data, total] = await Promise.all([
      this.causeRepository.findAll(filters, sort, pagination), // Get paginated data
      this.causeRepository.countDocuments(filters), // Count total documents
    ]);

    return {
      data,
      total,
    };
  }

  async createCause(
    title: string,
    description: string,
    ods: ODSEnum[],
    endDate: Date,
    communityId: string,
    createdBy: string,
  ): Promise<string> {
    // Create a new cause
    const cause = this.eventPublisher.mergeObjectContext(
      Cause.create({
        title,
        description,
        ods,
        endDate: CauseEndDate.create(endDate),
        communityId,
        createdBy,
      }),
    );

    // Create the new cause and save it
    const savedCause = await this.causeRepository.save(cause);

    cause.commit();
    // Return the ID of the newly created cause
    return savedCause.id.toString();
  }

  validateCauseEndDate(endDate: Date): boolean {
    try {
      CauseEndDate.create(endDate);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  getCause(id: string): Promise<Cause> {
    return this.causeRepository.findById(id);
  }

  async updateCause(
    id: string,
    description?: string,
    ods?: ODSEnum[],
  ): Promise<void> {
    // Find the existing cause by ID
    const existingCause = await this.causeRepository.findById(id);

    // Update optional fields if provided
    existingCause.description = description ?? existingCause.description;
    existingCause.ods = ods ?? existingCause.ods;

    // Update the changes in the repository
    await this.causeRepository.save(existingCause);
  }

  async getCauseSupporters(
    id: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<{
    data: string[];
    total: number;
  }> {
    const cause = await this.getCause(id);

    // Validate page and limit
    const validatedPage = Math.max(page, 1);
    const validatedLimit = Math.max(limit, 1);

    // Calculate the total number of supporters and the data to return
    const total = cause.supportersIds.length;
    const skip = (validatedPage - 1) * validatedLimit;
    const data = cause.supportersIds.slice(skip, skip + validatedLimit);

    return {
      data,
      total,
    };
  }

  async addCauseSupporter(id: string, userId: string): Promise<void> {
    const cause = await this.getCause(id);
    cause.addSupporter(userId);
    await this.causeRepository.save(cause);
  }

  async getCauseActions(
    id: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<{
    data: string[];
    total: number;
  }> {
    const cause = await this.getCause(id);

    // Validate page and limit
    const validatedPage = Math.max(page, 1);
    const validatedLimit = Math.max(limit, 1);

    // Calculate the total number of actions and the data to return
    const total = cause.actionsIds.length;
    const skip = (validatedPage - 1) * validatedLimit;
    const data = cause.actionsIds.slice(skip, skip + validatedLimit);

    return {
      data,
      total,
    };
  }

  async addCauseAction(
    type: ActionType,
    title: string,
    description: string,
    causeId: string,
    target: number,
    unit: string,
    createdBy: string,
    goodType?: string,
    location?: string,
    date?: Date,
  ): Promise<string> {
    const cause = await this.getCause(causeId);

    const actionId = await this.actionService.createAction(
      type,
      title,
      description,
      causeId,
      target,
      unit,
      createdBy,
      goodType,
      location,
      date,
    );

    cause.addAction(actionId);
    await this.causeRepository.save(cause);
    return actionId;
  }
}
