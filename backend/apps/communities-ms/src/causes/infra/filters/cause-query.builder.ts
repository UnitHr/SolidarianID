/**
 * @file This module exports the CauseFilter type and the CauseQueryBuilder class.
 * @module causes/infra/filters/cause-query.filter
 *
 * @description This module defines the structure for filtering causes in the application.
 * It includes optional properties for filtering by ODS (Objetivos de Desarrollo Sostenible)
 * and title using regular expressions. The CauseQueryBuilder class provides methods to
 * build these filters and sorting options.
 */

import {
  CauseSortBy,
  PaginationDefaults,
  SortDirection,
} from '@common-lib/common-lib/common/enum';
import { ODSEnum } from '@common-lib/common-lib/common/ods';

export type CauseFilter = {
  ods?: { $in: number[] };
  title?: { $regex: string; $options: string };
};

export type CauseSort = Record<string, 1 | -1>;

export type PaginationParams = {
  skip: number;
  limit: number;
};

export class CauseQueryBuilder {
  private filter: CauseFilter = {};

  private sort: CauseSort = {};

  private pagination: PaginationParams = {
    skip: 0,
    limit: PaginationDefaults.DEFAULT_LIMIT,
  };

  addOdsFilter(odsFilter?: ODSEnum[]): this {
    if (odsFilter && odsFilter.length > 0) {
      this.filter.ods = { $in: odsFilter };
    }
    return this;
  }

  addNameFilter(nameFilter?: string): this {
    if (nameFilter) {
      this.filter.title = { $regex: nameFilter, $options: 'i' };
    }
    return this;
  }

  addSort(
    sortBy?: CauseSortBy,
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

  buildFilter(): CauseFilter {
    return this.filter;
  }

  buildSort(): CauseSort {
    return this.sort;
  }

  buildPagination(): PaginationParams {
    return this.pagination;
  }
}
