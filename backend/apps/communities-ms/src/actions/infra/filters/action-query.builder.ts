import {
  ActionSortBy,
  PaginationDefaults,
  SortDirection,
} from '@common-lib/common-lib/common/enum';
import { ActionStatus } from '@communities-ms/actions/domain';

export type ActionFilter = {
  title?: { $regex: string; $options: string };
  status?: { $eq: string };
};

export type ActionSort = Record<string, 1 | -1>;

export type PaginationParams = {
  skip: number;
  limit: number;
};

export class ActionQueryBuilder {
  private filter: ActionFilter = {};

  private sort: ActionSort = {};

  private pagination: PaginationParams = {
    skip: 0,
    limit: PaginationDefaults.DEFAULT_LIMIT,
  };

  addNameFilter(nameFilter?: string): this {
    if (nameFilter) {
      this.filter.title = { $regex: nameFilter, $options: 'i' };
    }
    return this;
  }

  addStatusFilter(statusFilter?: ActionStatus): this {
    if (statusFilter) {
      this.filter.status = { $eq: statusFilter };
    }
    return this;
  }

  addSort(
    sortBy?: ActionSortBy,
    sortDirection: SortDirection = SortDirection.ASC,
  ): this {
    if (sortBy) {
      this.sort[sortBy] = sortDirection === SortDirection.DESC ? -1 : 1;
    }
    return this;
  }

  addPagination(
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): this {
    // Validate that page is at least 1
    const validatedPage = Math.max(page, 1);

    // Validate that limit is within the allowed values
    const validatedLimit = Math.min(
      Math.max(limit, 1), // Ensure it is at least 1
      PaginationDefaults.MAX_LIMIT, // Respect the maximum allowed limit
    );

    const skip = (validatedPage - 1) * validatedLimit;

    this.pagination = { skip, limit: validatedLimit };
    return this;
  }

  buildFilter(): ActionFilter {
    return this.filter;
  }

  buildSort(): ActionSort {
    return this.sort;
  }

  buildPagination(): PaginationParams {
    return this.pagination;
  }
}
