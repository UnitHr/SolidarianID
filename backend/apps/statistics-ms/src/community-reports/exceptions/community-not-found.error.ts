/**
 * @file This module exports the CommunityNotFoundError class.
 * @module modules/community-reports/exceptions/community-not-found.error
 *
 * @description This class represents an error that is thrown when a community is not found.
 * It extends the BaseDomainError class to provide a consistent error structure across the application.
 */

import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';

export class CommunityNotFoundError extends BaseDomainError {
  constructor(id: string) {
    super(`The community with the id "${id}" does not exist.`);
  }
}
