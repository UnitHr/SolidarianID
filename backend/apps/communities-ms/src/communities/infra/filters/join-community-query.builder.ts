import {
  CommunitySortBy,
  PaginationDefaults,
  SortDirection,
} from '@common-lib/common-lib/common/enum';

export type JoinCommunityFilter = {
  name?: { $regex: string; $options: string };
};

export type JoinCommunitySort = Record<string, 1 | -1>;

export type PaginationParams = {
  skip: number;
  limit: number;
};

export class JoinCommunityQueryBuilder {
  private filter: JoinCommunityFilter = {};

  private sort: JoinCommunitySort = {};

  private pagination: PaginationParams = {
    skip: 0,
    limit: PaginationDefaults.DEFAULT_LIMIT,
  };

  addNameFilter(nameFilter?: string): this {
    if (nameFilter) {
      this.filter.name = { $regex: nameFilter, $options: 'i' };
    }
    return this;
  }

  addSort(
    sortBy?: CommunitySortBy,
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

  buildFilter(): JoinCommunityFilter {
    return this.filter;
  }

  buildSort(): JoinCommunitySort {
    return this.sort;
  }

  buildPagination(): PaginationParams {
    return this.pagination;
  }
}
