/**
 * @file This module exports the CauseFilter type and the CauseQueryBuilder class.
 * @module causes/infra/filters/cause-query.filter
 *
 * @description This module defines the structure for filtering causes in the application.
 * It includes optional properties for filtering by ODS (Objetivos de Desarrollo Sostenible)
 * and title using regular expressions. The CauseQueryBuilder class provides methods to
 * build these filters and sorting options.
 */

import { CauseSortBy, SortDirection } from '@common-lib/common-lib/common/enum';
import { ODSEnum } from '@common-lib/common-lib/common/ods';

export type CauseFilter = {
  ods?: { $in: number[] };
  title?: { $regex: string; $options: string };
};

export type CauseSort = Record<string, 1 | -1>;

export class CauseQueryBuilder {
  private filter: CauseFilter = {};

  private sort: CauseSort = {};

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

  buildFilter(): CauseFilter {
    return this.filter;
  }

  buildSort(): CauseSort {
    return this.sort;
  }
}
