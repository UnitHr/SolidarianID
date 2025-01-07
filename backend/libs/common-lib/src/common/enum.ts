/**
 * @file This module exports various enums used across the application.
 * @module common/enum
 *
 * @description This module provides a collection of enums used throughout the application.
 */

export enum CauseSortBy {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
}

export enum ActionSortBy {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  TYPE = 'type',
  STATUS = 'status',
}

export enum CommunitySortBy {}

export enum CreateCommunitySortBy {
  CREATED_AT = 'createdAt',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum PaginationDefaults {
  DEFAULT_PAGE = 1,
  DEFAULT_LIMIT = 10,
  MAX_LIMIT = 100,
}
