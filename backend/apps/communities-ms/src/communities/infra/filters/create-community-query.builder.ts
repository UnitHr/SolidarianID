import {
  CreateCommunitySortBy,
  PaginationDefaults,
  SortDirection,
} from '@common-lib/common-lib/common/enum';

export type CreateCommunityFilter = {
  status?: { $eq: string };
  createdAt?: { $gte: Date };
};

export type CreateCommunitySort = Record<string, 1 | -1>;

export type PaginationParams = {
  skip: number;
  limit: number;
};

export class CreateCommunityQueryBuilder {
  private filter: CreateCommunityFilter = {};

  private sort: CreateCommunitySort = {};

  private pagination: PaginationParams = {
    skip: 0,
    limit: PaginationDefaults.DEFAULT_LIMIT,
  };

  addStatusFilter(statusFilter?: string): this {
    if (statusFilter) {
      this.filter.status = { $eq: statusFilter };
    }
    return this;
  }

  addCreatedAtFilter(fromDate?: Date): this {
    if (fromDate) {
      this.filter.createdAt = { $gte: fromDate };
    }
    return this;
  }

  addSort(
    sortBy?: CreateCommunitySortBy,
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

  buildFilter(): CreateCommunityFilter {
    return this.filter;
  }

  buildSort(): CreateCommunitySort {
    return this.sort;
  }

  buildPagination(): PaginationParams {
    return this.pagination;
  }
}
