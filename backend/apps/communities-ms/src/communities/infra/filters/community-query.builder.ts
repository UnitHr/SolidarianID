import {
  CommunitySortBy,
  PaginationDefaults,
  SortDirection,
} from '@common-lib/common-lib/common/enum';

export type CommunityFilter = {
  name?: { $regex: string; $options: string };
};

export type CommunitySort = Record<string, 1 | -1>;

export type PaginationParams = {
  skip: number;
  limit: number;
};

export class CommunityQueryBuilder {
  private filter: CommunityFilter = {};

  private sort: CommunitySort = {};

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

  buildFilter(): CommunityFilter {
    return this.filter;
  }

  buildSort(): CommunitySort {
    return this.sort;
  }

  buildPagination(): PaginationParams {
    return this.pagination;
  }
}
